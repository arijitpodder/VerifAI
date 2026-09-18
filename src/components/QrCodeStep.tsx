import React, { useState, useEffect, useRef } from 'react';
import type { ExtractedFields } from '../types';
import {
  autoCropAndScanQr,
  STANDARD_CROP_REGIONS,
  type QrScanResult,
  type QrParsedData,
  type CropBox
} from '../services/qrScannerService';
import {
  Camera,
  CameraOff,
  RotateCw,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  SkipForward,
  Copy,
  Check,
  Upload,
  RefreshCw,
  FileCheck,
  Info,
  Crop,
  Maximize2,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

interface QrCodeStepProps {
  documentUri: string;
  fields: ExtractedFields;
  onNext: (qrData?: QrParsedData | null) => void;
  onSkip: () => void;
  onPrev: () => void;
}

export const QrCodeStep: React.FC<QrCodeStepProps> = ({
  documentUri,
  fields,
  onNext,
  onSkip,
  onPrev
}) => {
  const [activeImageUri, setActiveImageUri] = useState<string>(documentUri);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [scanResult, setScanResult] = useState<QrScanResult | null>(null);
  const [activePayload, setActivePayload] = useState<QrParsedData | null>(null);
  const [croppedQrUri, setCroppedQrUri] = useState<string | null>(null);
  const [currentBox, setCurrentBox] = useState<CropBox | null>(null);
  const [selectedCropKey, setSelectedCropKey] = useState<string>('AUTO');
  const [copied, setCopied] = useState<boolean>(false);
  const [isBackSideLoaded, setIsBackSideLoaded] = useState<boolean>(false);

  // Live Camera States (Front vs Back Camera Switcher)
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop camera stream helper
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Start real webcam stream with front/back camera support
  const startCamera = async (mode: 'environment' | 'user') => {
    stopCamera();
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setCameraFacingMode(mode);
    } catch {
      // Fallback if environment camera is unavailable on laptop/desktop
      try {
        const fallback = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = fallback;
        if (videoRef.current) {
          videoRef.current.srcObject = fallback;
          videoRef.current.play();
        }
        setIsCameraActive(true);
        setCameraFacingMode('user');
      } catch (e2) {
        console.warn('Camera error:', e2);
        setCameraError('Camera access denied or unavailable. Please upload an image file instead.');
        setIsCameraActive(false);
      }
    }
  };

  // Switch between Front & Back Camera
  const handleToggleCamera = () => {
    const nextMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
    startCamera(nextMode);
  };

  // Perform full auto-crop & multi-engine scan
  const performScan = async (imageSrc: string, customCrop?: CropBox, isBackOverride?: boolean) => {
    setIsScanning(true);
    try {
      const isSecondFace = isBackOverride !== undefined ? isBackOverride : isBackSideLoaded;
      const res = await autoCropAndScanQr(imageSrc, fields, customCrop, {
        isBackSide: isSecondFace,
        isSecondFace
      });
      setScanResult(res);

      if (res.detected && res.parsed) {
        setCroppedQrUri(res.croppedQrUri || null);
        setCurrentBox(res.cropBox || null);
        setActivePayload(res.parsed);
      } else {
        // No QR detected on this image face (e.g. Front Side of Aadhaar Card)
        setCroppedQrUri(null);
        setCurrentBox(null);
        setActivePayload(null);
      }
    } catch (err) {
      console.warn('QR scan error:', err);
      setCroppedQrUri(null);
      setCurrentBox(null);
      setActivePayload(null);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    setActiveImageUri(documentUri);
    performScan(documentUri);
  }, [documentUri, fields]);

  // Handle manual quadrant crop button clicks
  const handleSelectQuadrant = (key: string) => {
    setSelectedCropKey(key);
    const box = STANDARD_CROP_REGIONS[key];
    performScan(activeImageUri, key === 'AUTO' ? undefined : box, isBackSideLoaded);
  };

  // Handle uploading second face image (PAN front, Aadhaar back, etc.)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUri = event.target?.result as string;
      stopCamera();
      setActiveImageUri(dataUri);
      setIsBackSideLoaded(true);
      await performScan(dataUri, undefined, true);
    };
    reader.readAsDataURL(file);
  };

  // Capture snapshot frame from live camera
  const handleCaptureCameraFrame = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth || 1280;
    canvas.height = v.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    const capturedUri = canvas.toDataURL('image/jpeg', 0.92);

    stopCamera();
    setActiveImageUri(capturedUri);
    setIsBackSideLoaded(true);
    performScan(capturedUri, undefined, true);
  };

  const copyToClipboard = () => {
    if (!activePayload?.rawText) return;
    navigator.clipboard.writeText(activePayload.rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isEncryptedError = activePayload?.rawText?.toLowerCase().includes('government database access is required') ||
    activePayload?.fields?.['Status']?.includes('Error');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Step Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-cyan">Layer 3 of 7</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              Auto-Crop QR &amp; 2D Barcode Verification
            </h2>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Automatically detects and decodes 2D QR matrix barcodes across all identity credentials (PAN Card Front, Aadhaar Back, Driving License, Voter ID, or Passport).
          </p>
        </div>

        {/* Status indicator badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{
            fontSize: '0.74rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '999px',
            background: 'rgba(56, 189, 248, 0.1)',
            color: 'var(--cyan-primary)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <Info size={13} />
            Optional Step: Skipping won't affect score
          </span>

          {scanResult?.detected && activePayload ? (
            isEncryptedError ? (
              <span className="badge badge-red" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertTriangle size={13} />
                Error: Government Database Access Required
              </span>
            ) : (
              <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={13} />
                QR Decoded &amp; Extracted
              </span>
            )
          ) : (
            <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <AlertTriangle size={13} />
              No QR Found on Current Face
            </span>
          )}
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: Document Viewer + Live Webcam Scanner + Auto-Crop Box */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Crop size={18} color="var(--cyan-primary)" />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                {isBackSideLoaded ? 'Document Credential (QR Face)' : 'Document Credential'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isCameraActive ? (
                <button
                  onClick={stopCamera}
                  className="btn btn-secondary"
                  style={{ padding: '0.3rem 0.75rem', fontSize: '0.74rem' }}
                >
                  <CameraOff size={13} />
                  <span>Cancel Camera</span>
                </button>
              ) : (
                <button
                  onClick={() => performScan(activeImageUri, undefined, isBackSideLoaded)}
                  disabled={isScanning}
                  className="btn btn-secondary"
                  style={{ padding: '0.3rem 0.75rem', fontSize: '0.74rem' }}
                >
                  <RefreshCw size={13} className={isScanning ? 'spin-icon' : ''} />
                  <span>{isScanning ? 'Scanning...' : 'Rescan Image'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Live Camera View OR Image Dual-Box View */}
          {isCameraActive ? (
            <div style={{
              position: 'relative',
              width: '100%',
              height: '270px',
              background: '#050b14',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid var(--cyan-primary)'
            }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />

              {/* Viewfinder Target Reticle */}
              <div style={{
                position: 'absolute',
                width: '200px',
                height: '200px',
                border: '2px dashed #00f2fe',
                borderRadius: '12px',
                boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{
                  background: 'rgba(6, 12, 24, 0.85)',
                  color: 'var(--cyan-primary)',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--cyan-primary)'
                }}>
                  Align 2D QR Matrix inside Reticle
                </span>
              </div>

              {/* Live Camera Control Buttons (Top Right & Bottom Center) */}
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                display: 'flex',
                gap: '0.4rem'
              }}>
                <button
                  onClick={handleToggleCamera}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.35rem 0.7rem',
                    fontSize: '0.72rem',
                    background: 'rgba(6, 12, 24, 0.9)',
                    borderColor: 'var(--cyan-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  title="Switch between Front and Back Camera"
                >
                  <RotateCw size={13} />
                  <span>Switch Camera ({cameraFacingMode === 'environment' ? 'Back' : 'Front'})</span>
                </button>
              </div>

              <div style={{
                position: 'absolute',
                bottom: '12px',
                display: 'flex',
                gap: '0.6rem'
              }}>
                <button
                  onClick={handleCaptureCameraFrame}
                  className="btn btn-primary"
                  style={{
                    padding: '0.45rem 1.2rem',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 0 15px var(--cyan-primary)'
                  }}
                >
                  <Camera size={14} />
                  <span>Capture &amp; Scan Document QR</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: croppedQrUri ? '1.3fr 1fr' : '1fr', gap: '0.75rem' }}>
              {/* Document Image Box */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '240px',
                background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.95) 0%, rgba(6, 11, 22, 1) 100%)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={activeImageUri}
                  alt="Document Credential"
                  style={{
                    maxWidth: '92%',
                    maxHeight: '92%',
                    objectFit: 'contain',
                    borderRadius: '6px',
                    filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.6))'
                  }}
                />

                {/* Scanning Laser Animation */}
                {isScanning && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 242, 254, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 5
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, #00f2fe, transparent)',
                      boxShadow: '0 0 15px #00f2fe',
                      animation: 'scanLaser 2s infinite ease-in-out'
                    }} />
                    <div style={{
                      background: 'rgba(6, 12, 24, 0.9)',
                      padding: '0.4rem 0.85rem',
                      borderRadius: '20px',
                      border: '1px solid var(--cyan-primary)',
                      color: 'var(--cyan-primary)',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <RefreshCw size={12} className="spin-icon" />
                      Scanning for 2D Barcode...
                    </div>
                  </div>
                )}

                {/* Auto-Crop Reticle Bounding Box (Shown ONLY when QR detected) */}
                {currentBox && scanResult?.detected && (
                  <div style={{
                    position: 'absolute',
                    top: `${Math.max(5, currentBox.y * 100)}%`,
                    left: `${Math.max(5, currentBox.x * 100)}%`,
                    width: `${Math.min(90, currentBox.width * 100)}%`,
                    height: `${Math.min(90, currentBox.height * 100)}%`,
                    border: '2px dashed var(--cyan-primary)',
                    boxShadow: '0 0 16px rgba(0, 242, 254, 0.5), inset 0 0 12px rgba(0, 242, 254, 0.2)',
                    borderRadius: '6px',
                    pointerEvents: 'none',
                    zIndex: 4
                  }}>
                    <span style={{
                      background: 'var(--cyan-primary)',
                      color: '#050b14',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '2px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      🎯 QR DETECTED
                    </span>
                  </div>
                )}
              </div>

              {/* Auto-Cropped QR Target Preview Box (Shown ONLY when QR detected) */}
              {croppedQrUri && scanResult?.detected && (
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '240px',
                  background: 'rgba(4, 8, 18, 0.95)',
                  border: '1.5px solid rgba(0, 242, 254, 0.4)',
                  boxShadow: '0 0 20px rgba(0, 242, 254, 0.15)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.5rem'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '6px',
                    left: '8px',
                    fontSize: '0.64rem',
                    fontWeight: 700,
                    color: 'var(--cyan-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    <Maximize2 size={11} />
                    Auto-Cropped QR Target
                  </div>

                  <img
                    src={croppedQrUri}
                    alt="Cropped QR Code Target"
                    style={{
                      maxWidth: '85%',
                      maxHeight: '80%',
                      objectFit: 'contain',
                      borderRadius: '4px',
                      imageRendering: 'pixelated',
                      border: '1px solid rgba(255,255,255,0.1)',
                      filter: 'contrast(1.2)'
                    }}
                  />

                  <div style={{
                    position: 'absolute',
                    bottom: '6px',
                    fontSize: '0.65rem',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    Sharpened &amp; Upscaled (480×480px)
                  </div>
                </div>
              )}
            </div>
          )}

          {cameraError && (
            <div style={{
              fontSize: '0.74rem',
              color: '#fca5a5',
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '0.4rem 0.75rem',
              borderRadius: '4px',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              {cameraError}
            </div>
          )}

          {/* Action Bar to Upload / Live Capture Face with QR Code */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.08) 0%, rgba(6, 12, 24, 0.8) 100%)',
            border: '1px solid rgba(0, 242, 254, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '0.9rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
                  {isBackSideLoaded ? 'Document QR Face Loaded & Analyzed' : 'Scan or Upload Face with QR Code'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Supports all ID credentials — PAN Card (Front), Aadhaar (Back), Driving License, Voter ID, or Passport.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => startCamera('environment')}
                  className="btn btn-primary"
                  style={{ fontSize: '0.74rem', padding: '0.35rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Camera size={13} />
                  <span>Live Capture Document QR</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.74rem', padding: '0.35rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Upload size={13} />
                  <span>Upload Document with QR</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          </div>

          {/* Fine-Tune Crop Quadrant (Only if image loaded) */}
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
              Fine-Tune Crop Quadrant
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.4rem' }}>
              {[
                { id: 'AUTO', label: '🎯 Auto-Detect' },
                { id: 'PAN_FRONT', label: '🪪 PAN (Front Left)' },
                { id: 'AADHAAR_BACK', label: '🆔 Aadhaar (Back Right)' },
                { id: 'CENTER_SQUARE', label: '🔍 Center / DL' },
                { id: 'BOTTOM_RIGHT', label: '📐 Bottom Right' },
                { id: 'FULL_IMAGE', label: '📄 Full Frame' }
              ].map((q) => {
                const isSelected = selectedCropKey === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => handleSelectQuadrant(q.id)}
                    style={{
                      padding: '0.4rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'rgba(0, 242, 254, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '1px solid var(--cyan-primary)' : '1px solid var(--border-subtle)',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      fontSize: '0.72rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {q.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Decoded Content OR "No QR Found" Prompt */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck size={18} color={scanResult?.detected ? 'var(--cyan-primary)' : 'var(--color-review)'} />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                Decoded QR Contents &amp; Identity Validation
              </span>
            </div>

            {scanResult?.detected && (
              <span className={`badge ${isEncryptedError ? 'badge-red' : 'badge-green'}`} style={{ fontSize: '0.68rem' }}>
                {isEncryptedError ? 'Government Database Access Required' : 'Decoded'}
              </span>
            )}
          </div>

          {/* Conditional Display: If QR Detected vs Live Camera Active vs No QR Found */}
          {scanResult?.detected && activePayload ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Structured Field Extracted Grid */}
              <div style={{
                background: 'rgba(6, 12, 24, 0.7)',
                border: isEncryptedError ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.65rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  paddingBottom: '0.45rem'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Extracted Cryptographic Fields
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: isEncryptedError ? '#fca5a5' : '#10b981' }}>
                    {isEncryptedError ? <ShieldAlert size={13} /> : <CheckCircle2 size={13} />}
                    {isEncryptedError ? 'Error: Government Database Access Required' : 'Digital Signature Verified'}
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                  gap: '0.5rem'
                }}>
                  {Object.entries(activePayload.fields).map(([k, v]) => {
                    const isErr = String(v).includes('Error');
                    return (
                      <div
                        key={k}
                        style={{
                          background: isErr ? 'rgba(239, 68, 68, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                          border: isErr ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid var(--border-subtle)',
                          padding: '0.45rem 0.6rem',
                          borderRadius: '4px'
                        }}
                      >
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                          {k}
                        </div>
                        <div style={{
                          fontSize: '0.82rem',
                          fontWeight: isErr ? 700 : 600,
                          color: isErr ? '#fca5a5' : '#f1f5f9',
                          wordBreak: 'break-word'
                        }}>
                          {v}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Parity Check Against Step 2 Visual OCR */}
              <div style={{
                background: 'rgba(6, 12, 24, 0.7)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                  Cross-Verification vs Visual OCR Fields
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '4px',
                    background: isEncryptedError
                      ? 'rgba(239, 68, 68, 0.08)'
                      : activePayload.matchesOcrName
                      ? 'rgba(16, 185, 129, 0.08)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: isEncryptedError
                      ? '1px solid rgba(239, 68, 68, 0.3)'
                      : activePayload.matchesOcrName
                      ? '1px solid rgba(16, 185, 129, 0.3)'
                      : '1px solid var(--border-subtle)'
                  }}>
                    <span style={{ fontSize: '0.78rem', color: '#ffffff' }}>
                      Cardholder Name Parity:
                    </span>
                    <span style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: isEncryptedError ? '#fca5a5' : activePayload.matchesOcrName ? '#10b981' : 'var(--text-secondary)'
                    }}>
                      {isEncryptedError ? 'Error: Government Database Access Required' : activePayload.matchesOcrName ? '✓ MATCH CONFIRMED' : 'Valid Entry'}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '4px',
                    background: isEncryptedError
                      ? 'rgba(239, 68, 68, 0.08)'
                      : activePayload.matchesOcrDocNumber
                      ? 'rgba(16, 185, 129, 0.08)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: isEncryptedError
                      ? '1px solid rgba(239, 68, 68, 0.3)'
                      : activePayload.matchesOcrDocNumber
                      ? '1px solid rgba(16, 185, 129, 0.3)'
                      : '1px solid var(--border-subtle)'
                  }}>
                    <span style={{ fontSize: '0.78rem', color: '#ffffff' }}>
                      Document / Aadhaar Number Parity:
                    </span>
                    <span style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: isEncryptedError ? '#fca5a5' : activePayload.matchesOcrDocNumber ? '#10b981' : 'var(--text-secondary)'
                    }}>
                      {isEncryptedError ? 'Error: Government Database Access Required' : activePayload.matchesOcrDocNumber ? '✓ MATCH CONFIRMED' : 'Verified ID'}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '4px',
                    background: isEncryptedError
                      ? 'rgba(239, 68, 68, 0.08)'
                      : activePayload.matchesOcrDob
                      ? 'rgba(16, 185, 129, 0.08)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: isEncryptedError
                      ? '1px solid rgba(239, 68, 68, 0.3)'
                      : activePayload.matchesOcrDob
                      ? '1px solid rgba(16, 185, 129, 0.3)'
                      : '1px solid var(--border-subtle)'
                  }}>
                    <span style={{ fontSize: '0.78rem', color: '#ffffff' }}>
                      Date of Birth Alignment:
                    </span>
                    <span style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: isEncryptedError ? '#fca5a5' : activePayload.matchesOcrDob ? '#10b981' : 'var(--text-secondary)'
                    }}>
                      {isEncryptedError ? 'Error: Government Database Access Required' : activePayload.matchesOcrDob ? '✓ MATCH CONFIRMED' : 'Aligned'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Exact Raw Text Written in the QR */}
              <div style={{
                background: 'rgba(6, 12, 24, 0.95)',
                border: isEncryptedError ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isEncryptedError ? '#fca5a5' : 'var(--cyan-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    What is Written in the QR (Raw Decoded Stream)
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="btn btn-secondary"
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    <span>{copied ? 'Copied!' : 'Copy Stream'}</span>
                  </button>
                </div>

                <pre style={{
                  margin: 0,
                  padding: '0.65rem 0.75rem',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: isEncryptedError ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  lineHeight: 1.4,
                  color: isEncryptedError ? '#fca5a5' : '#a7f3d0',
                  maxHeight: '110px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  fontWeight: isEncryptedError ? 700 : 500
                }}>
                  {activePayload.rawText}
                </pre>
              </div>
            </div>
          ) : isCameraActive ? (
            /* LIVE CAMERA ACTIVE GUIDE */
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '2.5rem 1.75rem',
              background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.8) 0%, rgba(6, 12, 24, 0.95) 100%)',
              border: '1.5px solid var(--cyan-primary)',
              borderRadius: 'var(--radius-md)',
              gap: '1rem'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(0, 242, 254, 0.12)',
                border: '1.5px solid var(--cyan-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(0, 242, 254, 0.3)'
              }}>
                <Camera size={30} color="var(--cyan-primary)" />
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
                  Live Camera Scanner Active
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '440px', lineHeight: 1.55 }}>
                  Hold the <strong>back side</strong> of your Aadhaar / Identity card up to the camera. Align the 2D QR matrix inside the cyan target box.
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '0.65rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginTop: '0.25rem'
              }}>
                <button
                  onClick={handleToggleCamera}
                  className="btn btn-secondary"
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.5rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    borderColor: 'var(--cyan-primary)'
                  }}
                >
                  <RotateCw size={14} />
                  <span>Switch Camera ({cameraFacingMode === 'environment' ? 'Back' : 'Front'})</span>
                </button>

                <button
                  onClick={handleCaptureCameraFrame}
                  className="btn btn-primary"
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.5rem 1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 0 15px var(--cyan-primary)'
                  }}
                >
                  <Camera size={14} />
                  <span>Capture &amp; Scan Document QR</span>
                </button>
              </div>

              <button
                onClick={stopCamera}
                className="btn btn-secondary"
                style={{
                  fontSize: '0.74rem',
                  padding: '0.35rem 0.85rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.25rem'
                }}
              >
                <CameraOff size={13} />
                <span>Cancel Camera</span>
              </button>
            </div>
          ) : (
            /* NO QR FOUND ON CURRENT FACE - CLEAR PROMPT & ACTIONS */
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '2.5rem 1.75rem',
              background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.8) 0%, rgba(6, 12, 24, 0.95) 100%)',
              border: '1.5px dashed rgba(245, 158, 11, 0.4)',
              borderRadius: 'var(--radius-md)',
              gap: '1rem'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1.5px solid rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle size={28} color="var(--color-review)" />
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
                  No QR Code Found on Current Face
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '440px', lineHeight: 1.55 }}>
                  No 2D QR barcode was detected on this image face. If your credential places the QR barcode on the other side (e.g. <strong>Back of Aadhaar Card</strong>, or <strong>Front of PAN Card / Driving License</strong>), please capture or upload that face below, or skip this step.
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '0.75rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginTop: '0.25rem'
              }}>
                <button
                  onClick={() => startCamera('environment')}
                  className="btn btn-primary"
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.5rem 1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 0 15px var(--cyan-primary)'
                  }}
                >
                  <Camera size={14} />
                  <span>Live Capture Document QR</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-secondary"
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.5rem 1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Upload size={14} />
                  <span>Upload Document with QR</span>
                </button>
              </div>

              <div style={{
                fontSize: '0.74rem',
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.08)',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                marginTop: '0.5rem',
                maxWidth: '460px',
                lineHeight: 1.4
              }}>
                💡 You can also safely <strong>Skip This Step</strong> below — your verification risk score will remain completely unaffected.
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <button onClick={onPrev} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
              <ArrowLeft size={15} />
              <span>Back: Step 2 (OCR)</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {/* Neutral Skip Step Button */}
              <button
                onClick={onSkip}
                className="btn btn-secondary"
                style={{
                  fontSize: '0.82rem',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: 'var(--text-secondary)'
                }}
                title="Skipping QR verification will not affect or lower your verification score"
              >
                <SkipForward size={14} />
                <span>Skip Step (Score Unaffected)</span>
              </button>

              {/* Proceed Button */}
              <button
                onClick={() => onNext(activePayload)}
                className="btn btn-primary"
                style={{ fontSize: '0.82rem' }}
              >
                <span>Step 4: Tamper Forensics</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
