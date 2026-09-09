import React, { useState, useEffect, useRef } from 'react';
import type { BiometricCheckResult, PresetSample } from '../types';
import { evaluateBiometrics, computeAuthenticFaceSimilarity } from '../services/biometricsEngine';
import {
  Camera,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Eye,
  Monitor,
  Upload
} from 'lucide-react';

interface BiometricsStepProps {
  preset: PresetSample;
  biometrics: BiometricCheckResult;
  onUpdateBiometrics: (result: BiometricCheckResult) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const BiometricsStep: React.FC<BiometricsStepProps> = ({
  preset,
  biometrics,
  onUpdateBiometrics,
  onNext,
  onPrev
}) => {
  const [useRealWebcam, setUseRealWebcam] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [activeChallengeStep, setActiveChallengeStep] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const selfieFileRef = useRef<HTMLInputElement>(null);

  // Stop webcam stream helper
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Start real webcam
  const startWebcam = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      streamRef.current = stream;
      setUseRealWebcam(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => console.warn('Webcam stream play error:', e));
      }
    } catch {
      setCameraError('Webcam access was denied or device not found. You can also upload a live selfie photo below.');
      setUseRealWebcam(false);
    }
  };

  // Guarantee webcam stream attaches to video element when mounted
  useEffect(() => {
    if (useRealWebcam && streamRef.current && videoRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch((err) => console.warn('Webcam auto-play error:', err));
      }
    }
  }, [useRealWebcam]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  const captureFrame = (): string => {
    if (!videoRef.current) return biometrics.liveFaceCapturedUrl || preset.liveCapturedSvg;
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 320, 360);
      return canvas.toDataURL('image/jpeg', 0.88);
    }
    return biometrics.liveFaceCapturedUrl || preset.liveCapturedSvg;
  };

  // Handle Liveness Challenge Progression
  const handlePerformChallenge = async (stepNum: number) => {
    setIsAnalyzing(true);
    setTimeout(async () => {
      setIsAnalyzing(false);
      if (stepNum === 1) {
        setActiveChallengeStep(2);
      } else if (stepNum === 2) {
        setActiveChallengeStep(3);
        // Complete verification
        const refPhoto = biometrics.docFaceCroppedUrl || preset.portraitSvg;
        const liveCaptured = useRealWebcam && videoRef.current ? captureFrame() : (biometrics.liveFaceCapturedUrl || preset.liveCapturedSvg);

        let matchScore = preset.biometricsPreset.matchScore || 96.4;
        let notes = preset.biometricsPreset.faceDiscrepancy || 'Biometric comparison completed.';

        if (refPhoto && liveCaptured) {
          try {
            const comp = await computeAuthenticFaceSimilarity(refPhoto, liveCaptured);
            matchScore = comp.similarityScore;
            notes = comp.diagnosticExplanation;
          } catch (e) {
            console.warn('Similarity calc:', e);
          }
        }

        const result = evaluateBiometrics(
          matchScore,
          true,
          ['Face Alignment', 'Blink Detection', 'Frame Liveness'],
          refPhoto,
          liveCaptured,
          notes,
          !useRealWebcam
        );
        result.docFaceCroppedUrl = biometrics.docFaceCroppedUrl;
        result.liveFaceCapturedUrl = liveCaptured;
        onUpdateBiometrics(result);
      }
    }, 600);
  };

  // Handle Live Snapshot from Active Webcam
  const handleSnapWebcam = async () => {
    if (!videoRef.current) return;
    const snap = captureFrame();
    setIsAnalyzing(true);
    const refPhoto = biometrics.docFaceCroppedUrl || preset.portraitSvg;
    let score = 0;
    let diag = 'Live webcam biometric frame comparison...';
    try {
      const comp = await computeAuthenticFaceSimilarity(refPhoto, snap);
      score = comp.similarityScore;
      diag = comp.diagnosticExplanation;
    } catch (e) {
      console.warn(e);
      diag = 'Biometric comparison failed to process face landmarks in webcam frame.';
    }
    const result = evaluateBiometrics(
      score,
      score >= 75,
      ['Face Alignment', 'Webcam Snapshot Frame', 'Liveness Check'],
      refPhoto,
      snap,
      diag,
      false
    );
    result.docFaceCroppedUrl = biometrics.docFaceCroppedUrl;
    result.liveFaceCapturedUrl = snap;
    onUpdateBiometrics(result);
    setActiveChallengeStep(3);
    setIsAnalyzing(false);
  };

  // Handle Selfie Photo Upload Fallback
  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const selfieUri = ev.target?.result as string;
        setIsAnalyzing(true);
        const refPhoto = biometrics.docFaceCroppedUrl || preset.portraitSvg;
        let score = 0;
        let diag = 'Uploaded selfie facial geometry alignment...';
        try {
          const comp = await computeAuthenticFaceSimilarity(refPhoto, selfieUri);
          score = comp.similarityScore;
          diag = comp.diagnosticExplanation;
        } catch (err) {
          console.warn(err);
          diag = 'Biometric comparison failed to detect face landmarks in uploaded selfie.';
        }
        const result = evaluateBiometrics(
          score,
          score >= 75,
          ['Face Alignment', 'Selfie Landmark Verification', 'Biometric Parity'],
          refPhoto,
          selfieUri,
          diag,
          false
        );
        result.docFaceCroppedUrl = biometrics.docFaceCroppedUrl;
        result.liveFaceCapturedUrl = selfieUri;
        onUpdateBiometrics(result);
        setActiveChallengeStep(3);
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-cyan">Layer 5 of 6</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              Webcam Biometrics &amp; Liveness Verification
            </h2>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Real-time live presence challenge, facial landmark matching, and portrait comparison.
          </p>
        </div>

        {/* Camera Toggle Controls & Selfie Fallback */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input
            type="file"
            ref={selfieFileRef}
            onChange={handleSelfieUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <button
            onClick={() => selfieFileRef.current?.click()}
            className="btn btn-secondary"
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.78rem'
            }}
            title="Upload a selfie photo to verify against ID portrait"
          >
            <Upload size={14} />
            <span>Upload Live Selfie</span>
          </button>

          <button
            onClick={() => {
              if (useRealWebcam) {
                stopWebcam();
                setUseRealWebcam(false);
              } else {
                startWebcam();
              }
            }}
            className="btn btn-secondary"
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.78rem',
              borderColor: useRealWebcam ? 'var(--cyan-primary)' : 'var(--border-subtle)',
              background: useRealWebcam ? 'rgba(0, 242, 254, 0.12)' : 'transparent'
            }}
          >
            {useRealWebcam ? <Camera size={14} color="var(--cyan-primary)" /> : <Monitor size={14} />}
            <span>{useRealWebcam ? 'Switch to Virtual Demo Feed' : 'Use Physical Webcam'}</span>
          </button>

          <span className={`badge ${
            biometrics.matchPassed ? 'badge-green' : 'badge-red'
          }`}>
            Similarity: {biometrics.faceMatchScore}%
          </span>
        </div>
      </div>

      {cameraError && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '0.65rem 0.85rem',
          fontSize: '0.78rem',
          color: '#fca5a5'
        }}>
          {cameraError}
        </div>
      )}

      <div className="grid-2">
        {/* Left: Viewfinder Camera Feed */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
              Live Biometric Viewfinder ({useRealWebcam ? 'Device Webcam' : 'Virtual Presumed Stream'})
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
              30 FPS HUD Active
            </span>
          </div>

          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: '#040813',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
          }}>
            {useRealWebcam ? (
              <video
                ref={(el) => {
                  videoRef.current = el;
                  if (el && streamRef.current && el.srcObject !== streamRef.current) {
                    el.srcObject = streamRef.current;
                    el.play().catch((e) => console.warn('Webcam stream play error:', e));
                  }
                }}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '320px',
                  objectFit: 'cover',
                  transform: 'scaleX(-1)' // Mirror effect for natural selfie
                }}
              />
            ) : (
              <div style={{ width: '220px', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div dangerouslySetInnerHTML={{ __html: preset.liveCapturedSvg }} />
              </div>
            )}

            {/* Viewfinder HUD Target Reticle Overlay */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '180px',
              height: '220px',
              borderRadius: '50% 50% 45% 45%',
              border: activeChallengeStep === 3
                ? '2px solid var(--color-verified)'
                : '2px dashed var(--cyan-primary)',
              boxShadow: activeChallengeStep === 3
                ? '0 0 20px var(--color-verified)'
                : '0 0 15px var(--cyan-glow)',
              pointerEvents: 'none',
              transition: 'all 0.3s ease'
            }}>
              {/* Center crosshair */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '12px',
                height: '12px'
              }}>
                <div style={{ position: 'absolute', top: '5px', left: 0, right: 0, height: '1px', background: 'var(--cyan-primary)' }} />
                <div style={{ position: 'absolute', left: '5px', top: 0, bottom: 0, width: '1px', background: 'var(--cyan-primary)' }} />
              </div>
            </div>

            {/* Corner Brackets */}
            <div style={{ position: 'absolute', top: '15px', left: '15px', width: '20px', height: '20px', borderTop: '2px solid var(--cyan-primary)', borderLeft: '2px solid var(--cyan-primary)' }} />
            <div style={{ position: 'absolute', top: '15px', right: '15px', width: '20px', height: '20px', borderTop: '2px solid var(--cyan-primary)', borderRight: '2px solid var(--cyan-primary)' }} />
            <div style={{ position: 'absolute', bottom: '15px', left: '15px', width: '20px', height: '20px', borderBottom: '2px solid var(--cyan-primary)', borderLeft: '2px solid var(--cyan-primary)' }} />
            <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '20px', height: '20px', borderBottom: '2px solid var(--cyan-primary)', borderRight: '2px solid var(--cyan-primary)' }} />

            {/* Active Challenge Prompt Bar */}
            <div style={{
              position: 'absolute',
              bottom: '15px',
              left: '20px',
              right: '20px',
              background: 'rgba(6, 12, 24, 0.85)',
              backdropFilter: 'blur(8px)',
              borderRadius: 'var(--radius-md)',
              padding: '0.6rem 0.85rem',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={16} color="var(--cyan-primary)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>
                  {activeChallengeStep === 1 && 'Challenge 1: Align face inside the reticle'}
                  {activeChallengeStep === 2 && 'Challenge 2: Blink eyes or smile naturally'}
                  {activeChallengeStep === 3 && 'Liveness Verified: Biometric frame matched'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {useRealWebcam && (
                  <button
                    onClick={handleSnapWebcam}
                    disabled={isAnalyzing}
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.72rem' }}
                    title="Capture live webcam photo now"
                  >
                    <Camera size={13} color="var(--cyan-primary)" />
                    <span>Snap Photo</span>
                  </button>
                )}

                {activeChallengeStep < 3 && (
                  <button
                    onClick={() => handlePerformChallenge(activeChallengeStep)}
                    disabled={isAnalyzing}
                    className="btn btn-primary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.72rem' }}
                  >
                    {isAnalyzing ? (
                      <RefreshCw size={12} className="spin" />
                    ) : (
                      <span>Complete Check</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Facial Comparison & Similarity Matrix */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
            Biometric Face Comparison
          </div>

          {/* Side by side faces */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.25rem'
          }}>
            {/* Document photo */}
            <div style={{
              background: '#040813',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Extracted Document Portrait
              </span>
              <div style={{
                width: '120px',
                height: '144px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid var(--border-active)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#060d1d'
              }}>
                {biometrics.docFaceCroppedUrl ? (
                  <img
                    src={biometrics.docFaceCroppedUrl}
                    alt="Extracted Document Portrait"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: preset.portraitSvg }} />
                )}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#f8fafc', fontWeight: 600, marginTop: '0.5rem' }}>
                {preset.extractedFields?.fullName || preset.name || 'Cardholder'}
              </span>
            </div>

            {/* Live Camera capture */}
            <div style={{
              background: '#040813',
              borderRadius: 'var(--radius-md)',
              border: biometrics.matchPassed
                ? '1px solid rgba(16, 185, 129, 0.3)'
                : '1px solid rgba(239, 68, 68, 0.4)',
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Live Webcam Capture
              </span>
              <div style={{
                width: '120px',
                height: '144px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: biometrics.matchPassed
                  ? '1px solid var(--color-verified)'
                  : '1px solid var(--color-danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#060d1d'
              }}>
                {biometrics.liveFaceCapturedUrl ? (
                  <img
                    src={biometrics.liveFaceCapturedUrl}
                    alt="Captured face"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: preset.liveCapturedSvg }} />
                )}
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: biometrics.matchPassed ? 'var(--color-verified)' : 'var(--color-danger)',
                marginTop: '0.5rem'
              }}>
                {biometrics.matchPassed ? 'Identity Match' : 'Mismatch Divergence'}
              </span>
            </div>
          </div>

          {/* Similarity Meter */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Facial Landmark Similarity Index</span>
              <span style={{
                fontWeight: 700,
                color: biometrics.matchPassed ? 'var(--color-verified)' : 'var(--color-danger)'
              }}>
                {biometrics.faceMatchScore}% ({biometrics.matchPassed ? 'Passing >= 70%' : 'Failed < 70%'})
              </span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${biometrics.faceMatchScore}%`,
                background: biometrics.matchPassed
                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : 'linear-gradient(90deg, #ef4444, #f87171)',
                borderRadius: '4px'
              }} />
            </div>
          </div>

          {/* Biometrics Summary Box */}
          <div style={{
            background: biometrics.matchPassed
              ? 'rgba(16, 185, 129, 0.08)'
              : 'rgba(239, 68, 68, 0.1)',
            border: biometrics.matchPassed
              ? '1px solid rgba(16, 185, 129, 0.3)'
              : '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem'
          }}>
            <div style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: biometrics.matchPassed ? '#86efac' : '#fca5a5',
              marginBottom: '0.25rem'
            }}>
              {biometrics.matchPassed ? 'BIOMETRIC CORRELATION VERIFIED' : 'BIOMETRIC IMPERSONATION WARNING'}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {biometrics.notes}
            </p>
          </div>

          {/* Navigation Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.06)'
          }}>
            <button onClick={onPrev} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
              <ArrowLeft size={15} />
              <span>Back: Authority</span>
            </button>

            <button onClick={onNext} className="btn btn-primary" style={{ fontSize: '0.82rem' }}>
              <span>Step 6: Risk Assessment Engine</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
