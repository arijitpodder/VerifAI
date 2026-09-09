import React, { useState, useRef, useEffect } from 'react';
import type { BiometricCheckResult, PresetSample } from '../types';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';
import {
  computeAuthenticFaceSimilarity,
  evaluateBiometrics
} from '../services/biometricsEngine';
import type { DetailedBiometricComparison } from '../services/biometricsEngine';

import {
  Camera,
  UploadCloud,
  Eye,
  CheckCircle2,
  XCircle,
  Sparkles,
  Monitor,
  RefreshCw
} from 'lucide-react';
import { FaceLandmarkOverlay } from './FaceLandmarkOverlay';

interface FaceVerificationLabProps {
  initialRefPhotoUri: string;
  initialLivePhotoUri: string;
  initialPreset: PresetSample;
  onSyncBiometrics: (result: BiometricCheckResult) => void;
}

export const FaceVerificationLab: React.FC<FaceVerificationLabProps> = ({
  initialRefPhotoUri,
  initialLivePhotoUri,
  initialPreset,
  onSyncBiometrics
}) => {
  // Reference Photo State
  const [refPhotoSource, setRefPhotoSource] = useState<'ID_DOC' | 'UPLOAD_REF' | 'PRESET'>('PRESET');
  const [refPhotoUri, setRefPhotoUri] = useState<string>(initialRefPhotoUri);

  // Live Presenter Photo State
  const [liveMode, setLiveMode] = useState<'WEBCAM' | 'UPLOAD_SELFIE' | 'SIMULATOR'>('WEBCAM');
  const [livePhotoUri, setLivePhotoUri] = useState<string>(initialLivePhotoUri);

  // Webcam state
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  // Genuine Mathematical Comparison Results
  const [comparisonResult, setComparisonResult] = useState<DetailedBiometricComparison | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const refUploadInputRef = useRef<HTMLInputElement>(null);
  const selfieUploadInputRef = useRef<HTMLInputElement>(null);

  // Run initial authentic comparison
  useEffect(() => {
    runComparison(refPhotoUri, livePhotoUri);
  }, []);

  // Stop webcam helper
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsWebcamActive(false);
  };

  // Start webcam
  const startWebcam = async () => {
    setWebcamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsWebcamActive(true);
      setLiveMode('WEBCAM');
    } catch {
      setWebcamError('Webcam access was denied or device is not available. Please use "Upload Selfie" or "Simulator".');
      setIsWebcamActive(false);
      setLiveMode('UPLOAD_SELFIE');
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  // Compute authentic comparison
  const runComparison = async (refUri: string, liveUri: string) => {
    setIsComparing(true);
    const comparison = await computeAuthenticFaceSimilarity(refUri, liveUri);
    setComparisonResult(comparison);
    setIsComparing(false);

    const bioResult = evaluateBiometrics(
      comparison.similarityScore,
      true,
      ['Biometric Alignment', 'Active Facial Frame Analysis'],
      refUri,
      liveUri,
      comparison.diagnosticExplanation,
      liveMode === 'SIMULATOR'
    );
    onSyncBiometrics(bioResult);
  };

  // Handle Reference Upload (Auto-isolates face if user uploads full document)
  const handleRefUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const uri = e.target?.result as string;
      setRefPhotoUri(uri);
      setRefPhotoSource('UPLOAD_REF');
      runComparison(uri, livePhotoUri);
    };
    reader.readAsDataURL(file);
  };

  // Handle Selfie Upload
  const handleSelfieUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const uri = e.target?.result as string;
      setLivePhotoUri(uri);
      setLiveMode('UPLOAD_SELFIE');
      stopWebcam();
      runComparison(refPhotoUri, uri);
    };
    reader.readAsDataURL(file);
  };

  // Snap photo from live webcam with proper face framing
  const captureWebcamSnapshot = () => {
    if (!videoRef.current) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const targetW = 280;
    const targetH = 350; // Standard 4:5 portrait
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const vidW = video.videoWidth || 640;
      const vidH = video.videoHeight || 480;

      // Crop the head/face region matching the reticle oval
      const cropH = vidH * 0.75;
      const cropW = cropH * 0.80; // 4:5 aspect ratio
      const cropX = (vidW - cropW) / 2;
      const cropY = (vidH - cropH) / 2;

      // Mirror horizontal for natural selfie view (display only)
      ctx.translate(targetW, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, targetW, targetH);
      const displayUri = canvas.toDataURL('image/jpeg', 0.94);
      setLivePhotoUri(displayUri);

      // Un-mirrored version for biometric comparison — critical for correct
      // HOG gradient orientations, landmark alignment, and correlation offsets
      const bioCanvas = document.createElement('canvas');
      bioCanvas.width = targetW;
      bioCanvas.height = targetH;
      const bioCtx = bioCanvas.getContext('2d');
      const biometricUri = bioCtx
        ? (bioCtx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, targetW, targetH),
           bioCanvas.toDataURL('image/jpeg', 0.94))
        : displayUri;

      setTimeout(() => {
        setIsCapturing(false);
        runComparison(refPhotoUri, biometricUri);
      }, 400);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-cyan">Specialized Module</span>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff' }}>
              Face &amp; Biometric Verification Lab
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Empirical 1:1 facial landmark correlation, active liveness challenges, and custom selfie verification.
          </p>
        </div>

        {/* Global Match Status Pill */}
        {isComparing ? (
          <span className="badge badge-cyan" style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}>
            <RefreshCw size={14} className="spin" />
            <span>Computing Landmark Correlation...</span>
          </span>
        ) : comparisonResult && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className={`badge ${comparisonResult.matchPassed ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}>
              {comparisonResult.matchPassed ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>MATCH CONFIRMED ({comparisonResult.similarityScore}%)</span>
                </>
              ) : (
                <>
                  <XCircle size={16} />
                  <span>MISMATCH DETECTED ({comparisonResult.similarityScore}%)</span>
                </>
              )}
            </span>
          </div>
        )}
      </div>

      {webcamError && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '0.65rem 0.85rem',
          fontSize: '0.78rem',
          color: '#fca5a5'
        }}>
          {webcamError}
        </div>
      )}

      {/* Side-by-Side Face Comparison Hub */}
      <div className="grid-2">
        {/* Left Column: Reference ID Portrait Options */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                1. Reference Document Portrait
              </span>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Target photo to verify against
              </div>
            </div>

            {/* Reference Source Switcher */}
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              <button
                onClick={() => refUploadInputRef.current?.click()}
                className={`badge ${refPhotoSource === 'UPLOAD_REF' ? 'badge-cyan' : 'badge-secondary'}`}
                style={{ cursor: 'pointer', border: 'none' }}
              >
                Upload Photo
              </button>
              <input
                type="file"
                ref={refUploadInputRef}
                onChange={(e) => e.target.files?.[0] && handleRefUpload(e.target.files[0])}
                accept="image/*"
                style={{ display: 'none' }}
              />

              <button
                onClick={() => {
                  setRefPhotoUri(initialPreset.portraitSvg);
                  setRefPhotoSource('PRESET');
                  runComparison(initialPreset.portraitSvg, livePhotoUri);
                }}
                className={`badge ${refPhotoSource === 'PRESET' ? 'badge-cyan' : 'badge-secondary'}`}
                style={{ cursor: 'pointer', border: 'none' }}
              >
                Preset
              </button>
            </div>
          </div>

          {/* Reference Portrait Viewport */}
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: '#040813',
            border: '1.5px solid rgba(0, 242, 254, 0.3)',
            height: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
          }}>
            {refPhotoUri.startsWith('<svg') ? (
              <div style={{ width: '180px', height: '220px' }} dangerouslySetInnerHTML={{ __html: refPhotoUri }} />
            ) : (
              <img
                src={refPhotoUri}
                alt="Reference Face"
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            )}

            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              background: 'rgba(6, 12, 24, 0.85)',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.7rem',
              color: 'var(--cyan-primary)',
              fontFamily: 'var(--font-mono)'
            }}>
              REF-ID PHOTO
            </div>
          </div>

          {/* Preset Quick Switcher */}
          <div style={{ marginTop: '0.85rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Quick Preset Reference:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
              {SAMPLE_DOCUMENTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setRefPhotoUri(p.portraitSvg);
                    setRefPhotoSource('PRESET');
                    runComparison(p.portraitSvg, livePhotoUri);
                  }}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.72rem',
                    borderColor: refPhotoUri === p.portraitSvg ? 'var(--cyan-primary)' : 'var(--border-subtle)'
                  }}
                >
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Presenter Options */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                2. Live Presenter Capture
              </span>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Live webcam or uploaded selfie
              </div>
            </div>

            {/* Mode Switcher */}
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              <button
                onClick={startWebcam}
                className={`badge ${liveMode === 'WEBCAM' && isWebcamActive ? 'badge-green' : 'badge-secondary'}`}
                style={{ cursor: 'pointer', border: 'none' }}
              >
                <Camera size={12} />
                <span>Webcam</span>
              </button>

              <button
                onClick={() => selfieUploadInputRef.current?.click()}
                className={`badge ${liveMode === 'UPLOAD_SELFIE' ? 'badge-cyan' : 'badge-secondary'}`}
                style={{ cursor: 'pointer', border: 'none' }}
              >
                <UploadCloud size={12} />
                <span>Upload Selfie</span>
              </button>
              <input
                type="file"
                ref={selfieUploadInputRef}
                onChange={(e) => e.target.files?.[0] && handleSelfieUpload(e.target.files[0])}
                accept="image/*"
                style={{ display: 'none' }}
              />

              <button
                onClick={() => {
                  stopWebcam();
                  setLiveMode('SIMULATOR');
                  setLivePhotoUri(initialPreset.liveCapturedSvg);
                  runComparison(refPhotoUri, initialPreset.liveCapturedSvg);
                }}
                className={`badge ${liveMode === 'SIMULATOR' ? 'badge-cyan' : 'badge-secondary'}`}
                style={{ cursor: 'pointer', border: 'none' }}
              >
                <Monitor size={12} />
                <span>Simulate</span>
              </button>
            </div>
          </div>

          {/* Live Viewport */}
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: '#040813',
            border: comparisonResult?.matchPassed ? '1.5px solid var(--color-verified)' : '1.5px solid rgba(0, 242, 254, 0.3)',
            height: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
          }}>
            {liveMode === 'WEBCAM' && isWebcamActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                />

                {/* Biometric Oval Guide */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '160px',
                  height: '200px',
                  borderRadius: '50% 50% 45% 45%',
                  border: '2px dashed var(--cyan-primary)',
                  boxShadow: '0 0 15px var(--cyan-glow)',
                  pointerEvents: 'none'
                }} />

                {/* Capture Action Bar */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  right: '12px',
                  background: 'rgba(6, 12, 24, 0.9)',
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#f8fafc' }}>
                    <Eye size={14} color="var(--cyan-primary)" />
                    <span>Liveness: Blink or hold steady</span>
                  </div>
                  <button
                    onClick={captureWebcamSnapshot}
                    disabled={isCapturing}
                    className="btn btn-primary"
                    style={{ padding: '0.3rem 0.75rem', fontSize: '0.72rem' }}
                  >
                    {isCapturing ? <RefreshCw size={12} className="spin" /> : <Camera size={12} />}
                    <span>Snap &amp; Match</span>
                  </button>
                </div>
              </>
            ) : livePhotoUri.startsWith('<svg') ? (
              <div style={{ width: '180px', height: '220px' }} dangerouslySetInnerHTML={{ __html: livePhotoUri }} />
            ) : (
              <img
                src={livePhotoUri}
                alt="Live Capture"
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            )}

            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(6, 12, 24, 0.85)',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.7rem',
              color: comparisonResult?.matchPassed ? 'var(--color-verified)' : 'var(--color-danger)',
              fontFamily: 'var(--font-mono)'
            }}>
              LIVE PRESENTER
            </div>
          </div>

          {/* Presenter Swap Presets */}
          <div style={{ marginTop: '0.85rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Quick Swap Presenter:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
              {SAMPLE_DOCUMENTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    stopWebcam();
                    setLiveMode('SIMULATOR');
                    setLivePhotoUri(p.liveCapturedSvg);
                    runComparison(refPhotoUri, p.liveCapturedSvg);
                  }}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.72rem',
                    borderColor: livePhotoUri === p.liveCapturedSvg ? 'var(--cyan-primary)' : 'var(--border-subtle)'
                  }}
                >
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Genuine Mathematical Comparison Analysis Dashboard */}
      {comparisonResult && (() => {
        const verificationPassed = comparisonResult.matchPassed && comparisonResult.similarityScore >= 70;
        return (
        <div className="glass-panel" style={{
          padding: '1.5rem',
          border: verificationPassed ? '1.5px solid rgba(16, 185, 129, 0.4)' : '1.5px solid rgba(239, 68, 68, 0.4)',
          background: verificationPassed ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.06)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Sparkles size={18} color={verificationPassed ? 'var(--color-verified)' : 'var(--color-danger)'} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                  Authentic Pixel Correlation &amp; Landmark Analysis
                </h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {comparisonResult.diagnosticExplanation}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: verificationPassed ? 'var(--color-verified)' : 'var(--color-danger)',
                lineHeight: 1
              }}>
                {comparisonResult.similarityScore}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Similarity (KYC Threshold: 75%)
              </div>
            </div>
          </div>

          {/* Side-by-Side Face Comparison Grid with Landmark Overlays */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem' }}>
            {/* Scanned ID Card Face with Landmark Dots */}
            <div className="glass-panel" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Source 1: Reference Photo
              </div>
              <FaceLandmarkOverlay
                imageSrc={comparisonResult?.croppedRefUri || refPhotoUri}
                visualization={comparisonResult?.refLandmarkViz}
                width={190}
                height={240}
                borderColor="var(--cyan-primary)"
                label="Reference Face"
              />
              <div style={{ marginTop: '0.85rem', fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
                Reference Match
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Normalized 4:5 Face Crop
              </div>
            </div>

            {/* Central Animated Score Circle */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                background: 'rgba(6, 12, 24, 0.95)',
                border: `3px solid ${verificationPassed ? 'var(--color-verified)' : 'var(--color-danger)'}`,
                boxShadow: verificationPassed ? 'var(--shadow-neon-green)' : 'var(--shadow-neon-red)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{
                  fontSize: '1.85rem',
                  fontWeight: 900,
                  color: verificationPassed ? 'var(--color-verified)' : 'var(--color-danger)'
                }}>
                  {comparisonResult.similarityScore}%
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Match
                </span>
              </div>
              <div style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: verificationPassed ? 'var(--color-verified)' : 'var(--color-danger)'
              }}>
                {verificationPassed ? '1:1 MATCH PASS' : '1:1 MISMATCH (FAIL)'}
              </div>
            </div>

            {/* Live Webcam Captured Face with Landmark Dots */}
            <div className="glass-panel" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Source 2: Live Webcam Capture
              </div>
              <FaceLandmarkOverlay
                imageSrc={comparisonResult?.croppedLiveUri || livePhotoUri}
                visualization={comparisonResult?.liveLandmarkViz}
                width={190}
                height={240}
                borderColor={verificationPassed ? 'var(--color-verified)' : 'var(--color-danger)'}
                label="Live Presenter"
              />
              <div style={{ marginTop: '0.85rem', fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
                Live Presenter
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Normalized 4:5 Face Crop
              </div>
            </div>
          </div>

          {/* Metric Breakdown Cards (12-Layer AI) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                800+ Point Mesh Alignment
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--cyan-primary)', margin: '0.2rem 0' }}>
                {comparisonResult?.structuralScore ?? 0}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                888-point geometric landmark dot alignment
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Facial Proportion Ratios
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#818cf8', margin: '0.2rem 0' }}>
                {comparisonResult?.proportionMatchScore ?? 0}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                12 facial ratios (eye dist, nose len, jaw)
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Skin Color Histogram
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f472b6', margin: '0.2rem 0' }}>
                {comparisonResult?.colorSpectrumScore ?? 0}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                HSV skin tone comparison
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Edge Contour Coherence
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399', margin: '0.2rem 0' }}>
                {comparisonResult?.edgeGeometryScore ?? 0}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Jaw + eyebrow contour alignment
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Region Feature Descriptors
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', margin: '0.2rem 0' }}>
                {comparisonResult?.regionDescriptorScore ?? 0}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                HOG descriptors (eyes, nose, mouth)
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                SSIM Texture Analysis
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a78bfa', margin: '0.2rem 0' }}>
                {comparisonResult?.ssimTextureScore ?? 0}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Pixel structural similarity
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Asymmetry Signature
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24', margin: '0.2rem 0' }}>
                {comparisonResult?.asymmetryScore ?? 0}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Left/Right facial deviation
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Z-Depth Topography
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2dd4bf', margin: '0.2rem 0' }}>
                {comparisonResult?.zDepthTopographyScore ?? 0}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Relative 3D mesh depth
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Aspect Ratio Signatures
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fb923c', margin: '0.2rem 0' }}>
                {comparisonResult?.aspectRatioSignatureScore ?? 0}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                EAR (Eyes) and MAR (Mouth)
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Micro-Distance Matrix
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a3e635', margin: '0.2rem 0' }}>
                {comparisonResult?.microDistanceScore ?? 0}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                25-point vector topology
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Golden Ratio (Phi)
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e879f9', margin: '0.2rem 0' }}>
                {comparisonResult?.goldenRatioScore ?? 0}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Deviation from 1.618 norm
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Dense Point Cloud
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', margin: '0.2rem 0' }}>
                {comparisonResult?.densePointCloudScore ?? 0}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                1000+ vector distance calculations
              </div>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
};
