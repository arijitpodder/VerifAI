import React from 'react';
import {
  Scan,
  CheckCircle2,
  FileSearch,
  Server,
  Camera,
  ShieldAlert
} from 'lucide-react';

interface HeroBannerProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ currentStep, onStepClick }) => {
  const steps = [
    { id: 1, label: 'Document Ingestion', icon: Scan, desc: 'ID/Passport capture' },
    { id: 2, label: 'OCR & Consistency', icon: FileSearch, desc: 'MRZ & date rules' },
    { id: 3, label: 'Tamper Forensics', icon: CheckCircle2, desc: 'Canvas ELA & edges' },
    { id: 4, label: 'Authority Registry', icon: Server, desc: 'ICAO & INTERPOL' },
    { id: 5, label: 'Webcam Biometrics', icon: Camera, desc: 'Liveness & match' },
    { id: 6, label: 'Risk Engine', icon: ShieldAlert, desc: 'Explainable verdict' },
  ];

  return (
    <div style={{ margin: '1.75rem 0 2rem 0' }}>
      <div className="glass-panel" style={{
        padding: '1.75rem 2rem',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(11, 17, 32, 0.8) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow decoration */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ maxWidth: '780px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-cyan">Defense-Grade Verification</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Multi-layer Document Tampering &amp; Identity Fraud Detection
              </span>
            </div>
            <h1 style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              lineHeight: 1.25,
              color: '#ffffff',
              marginBottom: '0.6rem'
            }}>
              Beyond facial comparison. <br />
              <span style={{
                background: 'linear-gradient(90deg, #00f2fe 0%, #38bdf8 50%, #818cf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Comprehensive forensic, consistency &amp; database verification.
              </span>
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Unlike conventional systems that merely compare a selfie with an ID photo, <strong>VERIFAI</strong> conducts
              independent validation layers: multi-field OCR, ICAO checksum verification, pixel-level Error Level Analysis (ELA)
              for digital tampering, simulated authority registry lookups, and webcam-based active liveness.
            </p>
          </div>

          <div style={{
            background: 'rgba(6, 12, 24, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            minWidth: '220px'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Security Protocol
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--cyan-primary)', margin: '0.2rem 0' }}>
              4-Tier Zero Trust
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Weight: Forensics (30%) + Auth (25%) + Bio (25%) + OCR (20%)
            </div>
          </div>
        </div>

        {/* Pipeline Stepper Navigation */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '0.65rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1.25rem'
        }}>
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <button
                key={step.id}
                onClick={() => onStepClick(step.id)}
                style={{
                  background: isActive
                    ? 'rgba(0, 242, 254, 0.12)'
                    : isCompleted
                    ? 'rgba(16, 185, 129, 0.08)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: isActive
                    ? '1px solid var(--cyan-primary)'
                    : isCompleted
                    ? '1px solid rgba(16, 185, 129, 0.4)'
                    : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 0.85rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'var(--cyan-primary)',
                    boxShadow: '0 0 10px var(--cyan-primary)'
                  }} />
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isActive ? 'var(--cyan-primary)' : isCompleted ? 'var(--color-verified)' : 'rgba(255,255,255,0.08)',
                    color: isActive || isCompleted ? '#050b14' : 'var(--text-secondary)'
                  }}>
                    <Icon size={14} />
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: isActive ? 'var(--cyan-primary)' : isCompleted ? 'var(--color-verified)' : 'var(--text-muted)'
                  }}>
                    0{step.id}
                  </span>
                </div>
                <div style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: isActive ? '#ffffff' : isCompleted ? '#e2e8f0' : 'var(--text-secondary)'
                }}>
                  {step.label}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {step.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
