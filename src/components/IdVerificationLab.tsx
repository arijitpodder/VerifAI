import React, { useState, useRef, useEffect } from 'react';
import type {
  AuthorityCheckResult,
  ConsistencyCheckResult,
  ExtractedFields,
  ForensicsResult,
  PresetSample
} from '../types';
import { SAMPLE_DOCUMENTS, svgToDataUri } from '../data/sampleDocuments';
import { extractTextFromSvg, runRealOcr, validateConsistency } from '../services/ocrEngine';
import { runForensicsAnalysis } from '../services/forensicsEngine';
import { queryAuthorityRegistry } from '../services/authorityRegistry';
import {
  FileText,
  UploadCloud,
  Camera,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sliders,
  Server,
  RefreshCw,
  Edit3,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Flame,
  Activity,
  Eye,
  AlertOctagon,
  Copy,
  Info,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

interface IdVerificationLabProps {
  initialDocumentUri: string;
  initialFields: ExtractedFields;
  initialConsistency: ConsistencyCheckResult;
  initialForensics: ForensicsResult;
  initialPreset?: PresetSample;
  initialAuthority?: AuthorityCheckResult;
  onSyncWithMainPipeline: (
    docUri: string,
    fields: ExtractedFields,
    consistency: ConsistencyCheckResult,
    forensics: ForensicsResult,
    authority?: AuthorityCheckResult,
    preset?: PresetSample
  ) => void;
  onNavigateToFaceLab?: () => void;
  onNavigateToPipeline?: () => void;
  onNavigateToFaceMatch?: () => void;
}

export const IdVerificationLab: React.FC<IdVerificationLabProps> = ({
  initialDocumentUri,
  initialFields,
  initialConsistency,
  initialForensics,
  initialPreset,
  initialAuthority,
  onSyncWithMainPipeline,
  onNavigateToFaceLab,
  onNavigateToPipeline,
  onNavigateToFaceMatch
}) => {
  const [activePresetId, setActivePresetId] = useState<string>(
    initialPreset?.id || SAMPLE_DOCUMENTS[0].id
  );
  const [docUri, setDocUri] = useState<string>(initialDocumentUri);
  const [fields, setFields] = useState<ExtractedFields>(initialFields);
  const [consistency, setConsistency] = useState<ConsistencyCheckResult>(initialConsistency);
  const [forensics, setForensics] = useState<ForensicsResult>(initialForensics);

  // Viewport & Forensics
  const [forensicMode, setForensicMode] = useState<'ORIGINAL' | 'ELA' | 'EDGE' | 'OVERLAY'>('ELA');
  const [elaAmplifier, setElaAmplifier] = useState<number>(18);
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  // OCR state
  const [isOcrRunning, setIsOcrRunning] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<{ status: string; progress: number }>({ status: '', progress: 0 });
  const [rawOcrText, setRawOcrText] = useState<string>('');
  const [showRawText, setShowRawText] = useState<boolean>(false);
  const [isEditingFields, setIsEditingFields] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Authority state
  const [authorityStatus, setAuthorityStatus] = useState<'ACTIVE' | 'REVOKED' | 'STOLEN' | 'EXPIRED' | 'NOT_FOUND'>('ACTIVE');
  const [isCheckingAuthority, setIsCheckingAuthority] = useState<boolean>(false);
  const [authorityResult, setAuthorityResult] = useState<AuthorityCheckResult | null>(initialAuthority || null);

  // Camera capture state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ensure initial state has generated ELA heatmap and raw text on mount
  useEffect(() => {
    const activePreset = SAMPLE_DOCUMENTS.find((p) => p.id === activePresetId) || initialPreset;
    const isTampered = activePreset?.forensicsPreset?.tampered ?? forensics.tamperingDetected;
    const regions = activePreset?.forensicsPreset?.tamperRegions ?? forensics.flaggedRegions;

    // Run forensics to get real ELA/Edge data URLs on mount if missing
    runForensicsAnalysis(docUri, regions, isTampered, elaAmplifier).then((fRes) => {
      setForensics(fRes);
      onSyncWithMainPipeline(docUri, fields, consistency, fRes, authorityResult || initialAuthority, activePreset);
    });

    // Populate initial raw text
    if (activePreset?.docImageSvg) {
      const fullText = extractTextFromSvg(activePreset.docImageSvg);
      if (fullText) setRawOcrText(fullText);
    } else if (fields.mrzLine1) {
      setRawOcrText(`${fields.mrzLine1}\n${fields.mrzLine2 || ''}\n${fields.fullName}`);
    }

    // Initialize authority query if not present
    if (initialAuthority) {
      setAuthorityResult(initialAuthority);
      setAuthorityStatus((initialAuthority.activeStatus as any) || 'ACTIVE');
    } else {
      queryAuthorityRegistry(fields.documentNumber, fields.documentType, fields.fullName).then((auth) => {
        setAuthorityResult(auth);
      });
    }
  }, []);

  // Handle Preset Select
  const handleSelectPreset = async (preset: PresetSample) => {
    setActivePresetId(preset.id);
    const uri = svgToDataUri(preset.docImageSvg);
    setDocUri(uri);
    setFields(preset.extractedFields);

    const extractedText = extractTextFromSvg(preset.docImageSvg);
    setRawOcrText(extractedText || `${preset.extractedFields.mrzLine1 || ''}\n${preset.extractedFields.mrzLine2 || ''}`);

    const cRes = validateConsistency(preset.extractedFields);
    setConsistency(cRes);

    const fRes = await runForensicsAnalysis(
      uri,
      preset.forensicsPreset.tamperRegions,
      preset.forensicsPreset.tampered,
      elaAmplifier
    );
    setForensics(fRes);

    // Sync authority query matching the preset
    const authRes = await queryAuthorityRegistry(
      preset.extractedFields.documentNumber,
      preset.extractedFields.documentType,
      preset.extractedFields.fullName,
      preset.authorityPreset.status,
      preset.authorityPreset.interpolStolen,
      preset.authorityPreset.notes
    );
    setAuthorityResult(authRes);
    setAuthorityStatus(preset.authorityPreset.status);

    onSyncWithMainPipeline(uri, preset.extractedFields, cRes, fRes, authRes, preset);
  };

  // Handle Custom File Upload
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUri = e.target?.result as string;
      setDocUri(dataUri);
      await triggerRealOcr(dataUri);
    };
    reader.readAsDataURL(file);
  };

  // Start Real OCR
  const triggerRealOcr = async (imgUri: string) => {
    setIsOcrRunning(true);
    setActivePresetId('custom');
    setOcrProgress({ status: 'Starting client-side OCR engine...', progress: 15 });

    const result = await runRealOcr(imgUri, (p) => {
      setOcrProgress(p);
    });

    setRawOcrText(result.rawText);
    setFields(result.fields);

    const cRes = validateConsistency(result.fields);
    setConsistency(cRes);

    // Real pixel forensics on uploaded image
    const fRes = await runForensicsAnalysis(imgUri, [], false, elaAmplifier);
    setForensics(fRes);

    const authRes = await queryAuthorityRegistry(
      result.fields.documentNumber,
      result.fields.documentType,
      result.fields.fullName,
      authorityStatus
    );
    setAuthorityResult(authRes);

    setIsOcrRunning(false);
    onSyncWithMainPipeline(imgUri, result.fields, cRes, fRes, authRes);
  };

  // Live Camera Capture
  const startCameraCapture = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera capture error:', err);
      setCameraError('Could not open camera stream. Please check browser permissions or upload an image file.');
    }
  };

  const snapPhoto = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 800;
    canvas.height = videoRef.current.videoHeight || 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUri = canvas.toDataURL('image/png');

    // Stop camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setDocUri(dataUri);

    await triggerRealOcr(dataUri);
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Handle Field Edit & Recalculate
  const handleFieldChange = (key: keyof ExtractedFields, val: any) => {
    const updated = { ...fields, [key]: val };

    // Dynamically recalculate age if DOB changed
    if (key === 'dateOfBirth') {
      try {
        const dob = new Date(val);
        if (!isNaN(dob.getTime())) {
          const now = new Date();
          let age = now.getFullYear() - dob.getFullYear();
          const m = now.getMonth() - dob.getMonth();
          if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
          updated.age = Math.max(1, Math.min(120, age));
        }
      } catch {}
    }

    setFields(updated);
    const cRes = validateConsistency(updated);
    setConsistency(cRes);
    onSyncWithMainPipeline(docUri, updated, cRes, forensics, authorityResult || undefined);
  };

  // Handle ELA Amplifier adjustment
  const handleAmplifierChange = async (newAmp: number) => {
    setElaAmplifier(newAmp);
    const activePreset = SAMPLE_DOCUMENTS.find((p) => p.id === activePresetId);
    const isTampered = activePreset?.forensicsPreset?.tampered ?? forensics.tamperingDetected;
    const regions = activePreset?.forensicsPreset?.tamperRegions ?? forensics.flaggedRegions;

    const fRes = await runForensicsAnalysis(docUri, regions, isTampered, newAmp);
    setForensics(fRes);
    onSyncWithMainPipeline(docUri, fields, consistency, fRes, authorityResult || undefined);
  };

  // Handle Authority Check
  const handleCheckAuthority = async () => {
    setIsCheckingAuthority(true);
    const authRes = await queryAuthorityRegistry(
      fields.documentNumber,
      fields.documentType,
      fields.fullName,
      authorityStatus,
      authorityStatus === 'STOLEN',
      authorityStatus === 'STOLEN' ? 'Document ID flagged in INTERPOL SLTD database.' : undefined
    );
    setAuthorityResult(authRes);
    setIsCheckingAuthority(false);
    onSyncWithMainPipeline(docUri, fields, consistency, forensics, authRes);
  };

  const handleCopyRawText = () => {
    navigator.clipboard.writeText(rawOcrText);
    setCopyFeedback('Copied to clipboard!');
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const getDisplayedImage = () => {
    switch (forensicMode) {
      case 'ELA':
        return forensics.elaImageDataUrl || docUri;
      case 'EDGE':
        return forensics.edgeImageDataUrl || docUri;
      case 'ORIGINAL':
      case 'OVERLAY':
      default:
        return docUri;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-cyan">Specialized ID Workbench</span>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff' }}>
              ID Document Verification Lab
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Real-time optical character recognition (OCR), pixel-level ELA tampering analysis, ICAO Doc 9303 checksums, and government database queries.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
          >
            <UploadCloud size={15} color="var(--cyan-primary)" />
            <span>Upload ID Image</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <button
            onClick={isCameraActive ? snapPhoto : startCameraCapture}
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
          >
            <Camera size={15} />
            <span>{isCameraActive ? 'Capture Snapshot' : 'Scan ID With Camera'}</span>
          </button>

          {onNavigateToFaceLab && (
            <button
              onClick={onNavigateToFaceLab}
              className="btn btn-secondary"
              style={{
                fontSize: '0.8rem',
                padding: '0.45rem 0.9rem',
                borderColor: 'rgba(0, 242, 254, 0.35)',
                background: 'rgba(0, 242, 254, 0.08)'
              }}
            >
              <span>Proceed to Face Lab</span>
              <ArrowRight size={14} color="var(--cyan-primary)" />
            </button>
          )}

          {onNavigateToFaceMatch && (
            <button
              onClick={onNavigateToFaceMatch}
              className="btn btn-primary"
              style={{
                fontSize: '0.8rem',
                padding: '0.45rem 0.9rem',
                background: 'linear-gradient(135deg, #00f2fe, #10b981)'
              }}
            >
              <span>1:1 Live Face Match</span>
              <ArrowRight size={14} />
            </button>
          )}

          {onNavigateToPipeline && (
            <button
              onClick={onNavigateToPipeline}
              className="btn btn-secondary"
              style={{
                fontSize: '0.8rem',
                padding: '0.45rem 0.9rem'
              }}
            >
              <span>Full Pipeline</span>
              <ArrowRight size={14} />
            </button>
          )}
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

      {/* Test Presets Quick Selector with Active Indicator */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
            Credential Benchmark Scenarios:
          </span>
          {activePresetId === 'custom' && (
            <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
              Custom Upload / Snapshot Active
            </span>
          )}
        </div>
        <div className="grid-4">
          {SAMPLE_DOCUMENTS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className="glass-panel"
                style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  border: isSelected ? '1.5px solid var(--cyan-primary)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(0, 242, 254, 0.08)' : 'rgba(15, 23, 42, 0.6)',
                  boxShadow: isSelected ? '0 0 16px rgba(0, 242, 254, 0.25)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: 'var(--cyan-primary)',
                    boxShadow: '0 0 8px var(--cyan-primary)'
                  }} />
                )}
                <div style={{ fontSize: '0.72rem', color: isSelected ? 'var(--cyan-primary)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {preset.badgeText}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', margin: '2px 0' }}>
                  {preset.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {preset.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Verification Grid */}
      <div className="grid-2">
        {/* Left: Document Viewport & Camera Stream */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
              Optical Forensic Viewport
            </span>
            {/* 4-Mode Forensic Switcher */}
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                onClick={() => setForensicMode('ORIGINAL')}
                className={`badge ${forensicMode === 'ORIGINAL' ? 'badge-cyan' : 'badge-secondary'}`}
                style={{ cursor: 'pointer', border: 'none' }}
              >
                <Eye size={12} />
                <span>Original</span>
              </button>
              <button
                onClick={() => setForensicMode('ELA')}
                className={`badge ${forensicMode === 'ELA' ? 'badge-cyan' : 'badge-secondary'}`}
                style={{ cursor: 'pointer', border: 'none' }}
              >
                <Flame size={12} />
                <span>ELA Heatmap</span>
              </button>
              <button
                onClick={() => setForensicMode('EDGE')}
                className={`badge ${forensicMode === 'EDGE' ? 'badge-cyan' : 'badge-secondary'}`}
                style={{ cursor: 'pointer', border: 'none' }}
              >
                <Activity size={12} />
                <span>Edge Seams</span>
              </button>
              <button
                onClick={() => setForensicMode('OVERLAY')}
                className={`badge ${forensicMode === 'OVERLAY' ? 'badge-cyan' : 'badge-secondary'}`}
                style={{ cursor: 'pointer', border: 'none' }}
              >
                <AlertOctagon size={12} />
                <span>Flagged Zones</span>
              </button>
            </div>
          </div>

          {/* Live Camera Viewfinder or Image Canvas */}
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: '#040813',
            border: forensics.tamperingDetected
              ? '1.5px solid rgba(239, 68, 68, 0.5)'
              : '1.5px solid rgba(0, 242, 254, 0.3)',
            minHeight: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: forensics.tamperingDetected
              ? '0 8px 30px rgba(239, 68, 68, 0.2)'
              : '0 8px 30px rgba(0, 0, 0, 0.5)'
          }}>
            {isCameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />

                {/* ID Card Framing Reticle */}
                <div style={{
                  position: 'absolute',
                  top: '15%',
                  bottom: '15%',
                  left: '10%',
                  right: '10%',
                  border: '2px dashed var(--cyan-primary)',
                  borderRadius: '12px',
                  boxShadow: '0 0 20px var(--cyan-glow)',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ background: 'rgba(4, 8, 19, 0.85)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)' }}>
                    ALIGN ID CARD INSIDE FRAME
                  </span>
                </div>
              </>
            ) : (
              <>
                <img
                  src={getDisplayedImage()}
                  alt="Document View"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />

                {/* Tampered Region Bounding Box Overlays */}
                {(forensicMode === 'OVERLAY' || forensicMode === 'ELA') &&
                  forensics.flaggedRegions.map((region) => {
                    const isHovered = hoveredRegionId === region.id;
                    const leftPercent = (region.x / 650) * 100;
                    const topPercent = (region.y / 420) * 100;
                    const widthPercent = (region.width / 650) * 100;
                    const heightPercent = (region.height / 420) * 100;

                    return (
                      <div
                        key={region.id}
                        onMouseEnter={() => setHoveredRegionId(region.id)}
                        onMouseLeave={() => setHoveredRegionId(null)}
                        style={{
                          position: 'absolute',
                          left: `${leftPercent}%`,
                          top: `${topPercent}%`,
                          width: `${widthPercent}%`,
                          height: `${heightPercent}%`,
                          border: '2px solid #f43f5e',
                          background: isHovered ? 'rgba(244, 63, 94, 0.35)' : 'rgba(244, 63, 94, 0.15)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          boxShadow: '0 0 12px rgba(244, 63, 94, 0.6)',
                          zIndex: 5
                        }}
                      >
                        <span style={{
                          position: 'absolute',
                          top: '-20px',
                          left: '0',
                          background: '#f43f5e',
                          color: '#ffffff',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '3px',
                          whiteSpace: 'nowrap',
                          fontFamily: 'var(--font-mono)'
                        }}>
                          {region.label}
                        </span>
                      </div>
                    );
                  })}
              </>
            )}

            {/* Laser scan animation when OCR running */}
            {isOcrRunning && <div className="scanner-beam" />}
          </div>

          {/* Mode Explanation Caption */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.65rem',
            fontSize: '0.72rem',
            color: 'var(--text-secondary)'
          }}>
            <Info size={13} color="var(--cyan-primary)" />
            <span>
              {forensicMode === 'ELA' && 'Error Level Analysis (ELA): Highlighting compression disparity. Hotspots indicate modified image regions.'}
              {forensicMode === 'EDGE' && 'Sobel Filter: Boundary edge gradients reveal digital splicing and cut-and-paste seams.'}
              {forensicMode === 'OVERLAY' && 'Flagged Anomaly Zones: Highlighted bounding boxes identifying localized alterations.'}
              {forensicMode === 'ORIGINAL' && 'Optical Capture: Direct camera/raster render of the credential.'}
            </span>
          </div>

          {/* ELA Sensitivity Tuner Slider */}
          <div style={{ marginTop: '0.85rem', background: '#040813', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                <Sliders size={13} color="var(--cyan-primary)" />
                <span>ELA Disparity Sensitivity Amplifier:</span>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)' }}>
                {elaAmplifier}x
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              value={elaAmplifier}
              onChange={(e) => handleAmplifierChange(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: 'var(--cyan-primary)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              <span>5x (Subtle Disparity)</span>
              <span>18x (Standard Forensic Baseline)</span>
              <span>35x (Ultra Compression Analysis)</span>
            </div>
          </div>

          {/* Forensic Score Summary Bar */}
          <div style={{
            marginTop: '0.85rem',
            background: forensics.tamperingDetected ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.08)',
            border: forensics.tamperingDetected ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {forensics.tamperingDetected ? (
                <ShieldAlert size={20} color="#f87171" />
              ) : (
                <ShieldCheck size={20} color="#4ade80" />
              )}
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: forensics.tamperingDetected ? '#fca5a5' : '#86efac' }}>
                  {forensics.tamperingDetected ? 'POTENTIAL TAMPERING DETECTED' : 'GENUINE SUBSTRATE VERIFIED'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  ELA Anomaly: {forensics.elaAnomalyScore}% • Edge Discontinuity: {forensics.edgeDiscontinuityScore}% • Noise Uniformity: {100 - forensics.noiseInconsistencyScore}%
                </div>
              </div>
            </div>
            <span className={`badge ${forensics.overallScore >= 80 ? 'badge-green' : 'badge-red'}`}>
              Forensics: {forensics.overallScore}/100
            </span>
          </div>
        </div>

        {/* Right: Real OCR Recognition & Extracted Fields */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="var(--cyan-primary)" />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                Optical Character Recognition (OCR) Engine
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => triggerRealOcr(docUri)}
                disabled={isOcrRunning}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              >
                {isOcrRunning ? <RefreshCw size={12} className="spin" /> : <RotateCcw size={12} />}
                <span>Re-Run OCR</span>
              </button>

              <button
                onClick={() => setIsEditingFields(!isEditingFields)}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              >
                {isEditingFields ? <Check size={12} color="var(--color-verified)" /> : <Edit3 size={12} />}
                <span>{isEditingFields ? 'Done Editing' : 'Edit Fields'}</span>
              </button>
            </div>
          </div>

          {/* OCR Progress Bar */}
          {isOcrRunning && (
            <div style={{ marginBottom: '1rem', background: '#040813', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--cyan-primary)' }}>{ocrProgress.status}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#ffffff' }}>{ocrProgress.progress}%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${ocrProgress.progress}%`, background: 'linear-gradient(90deg, #00f2fe, #38bdf8)', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          )}

          {/* Raw OCR Text Expandable Drawer */}
          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => setShowRawText(!showRawText)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.45rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              <span>Inspect Raw Recognized OCR Text Output ({rawOcrText ? rawOcrText.split('\n').length : 0} lines)</span>
              {showRawText ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showRawText && (
              <div style={{ position: 'relative', marginTop: '0.4rem' }}>
                <div className="terminal-box" style={{ maxHeight: '140px', fontSize: '0.72rem', whiteSpace: 'pre-wrap' }}>
                  {rawOcrText || 'No raw text recognized yet. Click "Re-Run OCR" or upload an image.'}
                </div>
                <button
                  onClick={handleCopyRawText}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    fontSize: '0.65rem',
                    color: 'var(--cyan-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Copy size={11} />
                  <span>{copyFeedback || 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Structured Fields Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.65rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Full Legal Name</div>
                {isEditingFields ? (
                  <input
                    type="text"
                    value={fields.fullName}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    style={{ width: '100%', background: '#060913', border: '1px solid var(--cyan-primary)', color: '#ffffff', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                ) : (
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>{fields.fullName}</div>
                )}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Document Identifier</div>
                {isEditingFields ? (
                  <input
                    type="text"
                    value={fields.documentNumber}
                    onChange={(e) => handleFieldChange('documentNumber', e.target.value)}
                    style={{ width: '100%', background: '#060913', border: '1px solid var(--cyan-primary)', color: 'var(--cyan-primary)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}
                  />
                ) : (
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)' }}>{fields.documentNumber}</div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date of Birth</div>
                {isEditingFields ? (
                  <input
                    type="date"
                    value={fields.dateOfBirth}
                    onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                    style={{ width: '100%', background: '#060913', border: '1px solid var(--cyan-primary)', color: '#ffffff', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem' }}
                  />
                ) : (
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>{fields.dateOfBirth} ({fields.age}y)</div>
                )}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Expiry Date</div>
                {isEditingFields ? (
                  <input
                    type="date"
                    value={fields.expiryDate}
                    onChange={(e) => handleFieldChange('expiryDate', e.target.value)}
                    style={{ width: '100%', background: '#060913', border: '1px solid var(--cyan-primary)', color: '#ffffff', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem' }}
                  />
                ) : (
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: consistency.expiryValid ? 'var(--color-verified)' : 'var(--color-danger)' }}>
                    {fields.expiryDate}
                  </div>
                )}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Issuing Authority</div>
                {isEditingFields ? (
                  <input
                    type="text"
                    value={fields.issuingCountry}
                    onChange={(e) => handleFieldChange('issuingCountry', e.target.value)}
                    style={{ width: '100%', background: '#060913', border: '1px solid var(--cyan-primary)', color: '#ffffff', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem' }}
                  />
                ) : (
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>{fields.issuingCountry}</div>
                )}
              </div>
            </div>

            {/* Additional Fields Row: Document Type & Nationality */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Document Type</div>
                {isEditingFields ? (
                  <select
                    value={fields.documentType}
                    onChange={(e) => handleFieldChange('documentType', e.target.value)}
                    style={{ width: '100%', background: '#060913', border: '1px solid var(--cyan-primary)', color: '#ffffff', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem' }}
                  >
                    <option value="PASSPORT">PASSPORT</option>
                    <option value="NATIONAL_ID">NATIONAL ID CARD</option>
                    <option value="DRIVERS_LICENSE">DRIVER LICENSE</option>
                  </select>
                ) : (
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>
                    {fields.documentType === 'PASSPORT' ? 'International Passport' : fields.documentType === 'DRIVERS_LICENSE' ? 'Driver License' : 'National Identity Card'}
                  </div>
                )}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Nationality / Citizenship</div>
                {isEditingFields ? (
                  <input
                    type="text"
                    value={fields.nationality}
                    onChange={(e) => handleFieldChange('nationality', e.target.value)}
                    style={{ width: '100%', background: '#060913', border: '1px solid var(--cyan-primary)', color: '#ffffff', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem' }}
                  />
                ) : (
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>{fields.nationality} ({fields.gender})</div>
                )}
              </div>
            </div>

            {/* Consistency Validation Rules Full Checklist (All 6 rules, including MRZ Parity!) */}
            <div style={{ marginTop: '0.5rem', background: '#040813', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>Data Integrity &amp; Parity Rules</span>
                <span className={`badge ${consistency.score >= 80 ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.65rem' }}>
                  Score: {consistency.score}/100 ({consistency.passedCount}/{consistency.totalChecks} Passed)
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {consistency.details.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.72rem' }}>
                    {r.passed ? <CheckCircle2 size={13} color="var(--color-verified)" /> : <XCircle size={13} color="var(--color-danger)" />}
                    <span style={{ color: r.passed ? '#e2e8f0' : '#fca5a5', fontWeight: r.passed ? 400 : 600 }}>
                      {r.rule}: {r.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Authority Check Tester & Gateway Ledger Card */}
            <div style={{ marginTop: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Server size={14} color="var(--cyan-primary)" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>Simulate Authority Registry Query</span>
                </div>
                <button
                  onClick={handleCheckAuthority}
                  disabled={isCheckingAuthority}
                  className="btn btn-primary"
                  style={{ padding: '0.25rem 0.65rem', fontSize: '0.72rem' }}
                >
                  {isCheckingAuthority ? 'Querying...' : 'Query Registry'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: authorityResult ? '0.6rem' : 0 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Status Filter:</span>
                <select
                  value={authorityStatus}
                  onChange={(e) => setAuthorityStatus(e.target.value as any)}
                  style={{
                    background: '#040813',
                    border: '1px solid var(--border-subtle)',
                    color: '#f8fafc',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem'
                  }}
                >
                  <option value="ACTIVE">ACTIVE (Legitimate Record)</option>
                  <option value="STOLEN">STOLEN (INTERPOL SLTD Flag)</option>
                  <option value="REVOKED">REVOKED (Cancelled by Issuer)</option>
                  <option value="EXPIRED">EXPIRED (Past Valid Date)</option>
                  <option value="NOT_FOUND">NOT_FOUND (Missing in Database)</option>
                </select>
                {authorityResult && (
                  <span className={`badge ${authorityResult.score >= 80 ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.65rem' }}>
                    {authorityResult.queryStatus}
                  </span>
                )}
              </div>

              {/* Detailed Authority Ledger Card */}
              {authorityResult && (
                <div style={{
                  background: '#040813',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  fontSize: '0.72rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Gateway Registry:</span>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>{authorityResult.registryName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Record ID:</span>
                    <span style={{ color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)' }}>{authorityResult.recordId}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Ledger Tx Hash:</span>
                    <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      {authorityResult.ledgerTxHash.substring(0, 18)}...
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Registry Notes:</span>
                    <span style={{ color: authorityResult.interpolStolenRecord ? '#fca5a5' : '#e2e8f0' }}>
                      {authorityResult.notes}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdVerificationLab;
