import React, { useRef } from 'react';
import type { PresetSample } from '../types';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';
import {
  UploadCloud,
  FileCheck2,
  ShieldX,
  UserX,
  Play,
  ArrowRight,
  RotateCcw,
  RotateCw,
  RefreshCw
} from 'lucide-react';

interface DocumentUploadStepProps {
  selectedPreset: PresetSample;
  onSelectPreset: (preset: PresetSample) => void;
  onCustomUpload: (file: File) => void;
  onRotateDocument?: (degrees: 90 | 180 | 270 | -90) => void;
  onProceedToAnalysis: () => void;
  onRunFullWorkflow: () => void;
  documentDataUri: string;
  onNavigateToFaceMatch?: () => void;
}

export const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({
  selectedPreset,
  onSelectPreset,
  onCustomUpload,
  onRotateDocument,
  onProceedToAnalysis,
  onRunFullWorkflow,
  documentDataUri,
  onNavigateToFaceMatch
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onCustomUpload(e.target.files[0]);
    }
  };

  const getPresetIcon = (badgeType: string) => {
    switch (badgeType) {
      case 'verified':
        return <FileCheck2 size={16} color="var(--color-verified)" />;
      case 'danger':
        return <ShieldX size={16} color="var(--color-danger)" />;
      case 'warning':
      default:
        return <UserX size={16} color="var(--color-review)" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Quick Launch Banner for 1:1 ID Card to Live Face Match */}
      {onNavigateToFaceMatch && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
          border: '1px solid rgba(0, 242, 254, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>NEW FEATURE</span>
            <div>
              <strong style={{ color: '#ffffff', fontSize: '0.88rem' }}>1:1 ID Card to Live Webcam Face Matcher</strong>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Upload any ID card, tell the cardholder name, scan the photo, and verify with live webcam.
              </div>
            </div>
          </div>
          <button
            onClick={onNavigateToFaceMatch}
            className="btn btn-primary"
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.78rem' }}
          >
            <span>Launch ID &amp; Live Face Match</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Test Scenarios Quick Picker */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              Step 1: Document Ingestion &amp; Scenario Selection
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Choose a curated verification test case or upload a custom government-issued ID / passport.
            </p>
          </div>
          <div className="badge badge-cyan">
            4 Real-World Test Presets
          </div>
        </div>

        <div className="grid-4">
          {SAMPLE_DOCUMENTS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="glass-panel"
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  border: isSelected
                    ? '1.5px solid var(--cyan-primary)'
                    : '1px solid var(--border-subtle)',
                  background: isSelected
                    ? 'rgba(0, 242, 254, 0.08)'
                    : 'var(--bg-card)',
                  boxShadow: isSelected ? 'var(--shadow-neon-cyan)' : 'none',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className={`badge ${
                    preset.badgeType === 'verified'
                      ? 'badge-green'
                      : preset.badgeType === 'danger'
                      ? 'badge-red'
                      : 'badge-amber'
                  }`} style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}>
                    {getPresetIcon(preset.badgeType)}
                    {preset.badgeText}
                  </span>
                  {isSelected && (
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--cyan-primary)',
                      boxShadow: '0 0 8px var(--cyan-primary)'
                    }} />
                  )}
                </div>

                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                  {preset.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                  {preset.subtitle}
                </div>

                <div style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  paddingTop: '0.5rem'
                }}>
                  Expected Risk:{' '}
                  <strong style={{
                    color: preset.expectedResult === 'VERIFIED'
                      ? 'var(--color-verified)'
                      : 'var(--color-danger)'
                  }}>
                    {preset.expectedResult.replace('_', ' ')}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Document Preview & Dropzone */}
      <div className="grid-2">
        {/* Left: Active Document Card Viewfinder */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                Document Image Stream
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                [Resolution: 650×420 px]
              </span>
            </div>

            {onRotateDocument && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  onClick={() => onRotateDocument(-90)}
                  className="btn btn-secondary"
                  style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}
                  title="Rotate Left 90°"
                >
                  <RotateCcw size={12} color="var(--cyan-primary)" />
                  <span>⟲ 90°</span>
                </button>
                <button
                  onClick={() => onRotateDocument(90)}
                  className="btn btn-secondary"
                  style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}
                  title="Rotate Right 90°"
                >
                  <RotateCw size={12} color="var(--cyan-primary)" />
                  <span>⟳ 90°</span>
                </button>
                <button
                  onClick={() => onRotateDocument(180)}
                  className="btn btn-primary"
                  style={{
                    padding: '0.2rem 0.75rem',
                    fontSize: '0.72rem',
                    background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.25) 0%, rgba(16, 185, 129, 0.25) 100%)',
                    border: '1px solid var(--cyan-primary)'
                  }}
                  title="Flip 180° if ID is upside down"
                >
                  <RefreshCw size={12} />
                  <span>🔄 Flip 180°</span>
                </button>
              </div>
            )}
          </div>

          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: '#040813',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '260px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
          }}>
            {/* Laser scanning beam */}
            <div className="scanner-beam" />

            {/* Document Image / SVG Display */}
            <img
              src={documentDataUri}
              alt="Active Document Preview"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: 'var(--radius-md)'
              }}
            />

            {/* Viewfinder Target Reticle corners */}
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              width: '18px',
              height: '18px',
              borderTop: '2px solid var(--cyan-primary)',
              borderLeft: '2px solid var(--cyan-primary)',
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '18px',
              height: '18px',
              borderTop: '2px solid var(--cyan-primary)',
              borderRight: '2px solid var(--cyan-primary)',
              pointerEvents: 'none'
            }} />

            {/* Quick Floating Rotate & Flip Overlay */}
            {onRotateDocument && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 15,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <button
                  onClick={() => onRotateDocument(180)}
                  className="btn btn-primary"
                  style={{
                    padding: '0.28rem 0.75rem',
                    fontSize: '0.72rem',
                    background: 'rgba(6, 12, 24, 0.9)',
                    backdropFilter: 'blur(8px)',
                    border: '1.5px solid #fbbf24',
                    color: '#fef08a',
                    fontWeight: 700,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.6)'
                  }}
                  title="Flip card 180° if ID is upside down"
                >
                  <RefreshCw size={12} />
                  <span>🔄 Flip 180°</span>
                </button>
                <button
                  onClick={() => onRotateDocument(90)}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.28rem 0.6rem',
                    fontSize: '0.72rem',
                    background: 'rgba(6, 12, 24, 0.9)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--cyan-primary)',
                    color: 'var(--cyan-primary)',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.6)'
                  }}
                  title="Rotate 90° Clockwise"
                >
                  <RotateCw size={12} />
                  <span>⟳ 90°</span>
                </button>
              </div>
            )}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              width: '18px',
              height: '18px',
              borderBottom: '2px solid var(--cyan-primary)',
              borderLeft: '2px solid var(--cyan-primary)'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              width: '18px',
              height: '18px',
              borderBottom: '2px solid var(--cyan-primary)',
              borderRight: '2px solid var(--cyan-primary)'
            }} />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.85rem',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)'
          }}>
            <span>Target: <strong style={{ color: '#ffffff' }}>{selectedPreset.name}</strong></span>
            <span>Doc No: <code style={{ color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)' }}>{selectedPreset.extractedFields.documentNumber}</code></span>
          </div>
        </div>

        {/* Right: Custom Upload Dropzone & Action Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            className="glass-panel"
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              border: '2px dashed rgba(0, 242, 254, 0.3)',
              cursor: 'pointer',
              background: 'rgba(15, 23, 42, 0.4)',
              borderRadius: 'var(--radius-lg)',
              flex: 1,
              transition: 'all 0.2s ease'
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                onCustomUpload(e.dataTransfer.files[0]);
              }
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(0, 242, 254, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              border: '1px solid rgba(0, 242, 254, 0.3)'
            }}>
              <UploadCloud size={28} color="var(--cyan-primary)" />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
              Upload Custom Document
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '300px', marginBottom: '0.75rem' }}>
              Drag &amp; drop an ID card, Passport photo, or Driver's License (JPEG, PNG, SVG)
            </p>
            <span className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '0.4rem 0.9rem' }}>
              Browse Local Files
            </span>
          </div>

          {/* Workflow Trigger Box */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
              Execution Control
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Run the verification pipeline step-by-step to inspect forensic layers, or trigger full automated end-to-end evaluation.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={onRunFullWorkflow}
                className="btn btn-primary"
                style={{ flex: 1, minWidth: '180px' }}
              >
                <Play size={16} fill="#050b14" />
                <span>Run Full Automated Pipeline</span>
              </button>

              <button
                onClick={onProceedToAnalysis}
                className="btn btn-secondary"
                style={{ flex: 1, minWidth: '150px' }}
              >
                <span>Inspect Step 2: OCR</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
