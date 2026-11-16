import React from 'react';
import {
  Monitor,
  ShieldCheck,
  Scan,
  UserCheck,
  FileText
} from 'lucide-react';
import type { AppMode } from './Navbar';
import { soundEffects } from '../services/soundEffects';

interface CyberMobileViewProps {
  children: React.ReactNode;
  currentStep: number;
  onStepClick: (step: number) => void;
  activeMode: AppMode;
  onChangeMode: (mode: AppMode) => void;
  onExitMobile: () => void;
  onOpenKavach: () => void;
  onOpenAuditLog: () => void;
  auditCount: number;
}

const STEP_DEFINITIONS = [
  { step: 1, label: '01 Ingest', title: 'Document Ingestion' },
  { step: 2, label: '02 OCR', title: 'OCR & Consistency' },
  { step: 3, label: '03 QR Code', title: 'QR Verification' },
  { step: 4, label: '04 Forensics', title: 'Tamper Forensics' },
  { step: 5, label: '05 Authority', title: 'Authority Registry' },
  { step: 6, label: '06 Biometrics', title: 'Webcam Biometrics' },
  { step: 7, label: '07 Risk Engine', title: 'Risk Verdict' },
];

export const CyberMobileView: React.FC<CyberMobileViewProps> = ({
  children,
  currentStep,
  onStepClick,
  activeMode,
  onChangeMode,
  onExitMobile,
  onOpenKavach,
  onOpenAuditLog,
  auditCount
}) => {
  return (
    <div className="cyber-mobile-app-container">
      {/* ── STICKY TOP CYBER APP BAR ── */}
      <header className="cyber-mobile-top-bar">
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              background: 'linear-gradient(135deg, rgba(0,242,254,0.3) 0%, rgba(99,102,241,0.3) 100%)',
              border: '1px solid #00f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(0,242,254,0.4)'
            }}
          >
            <ShieldCheck size={16} color="#00f2fe" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(120deg, #ffffff 30%, #00f2fe 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                VERIFAI
              </span>
              <span
                className="badge badge-cyan"
                style={{ fontSize: '0.52rem', padding: '0.08rem 0.35rem' }}
              >
                v4.8
              </span>
            </div>
          </div>
        </div>

        {/* Right Tools: Kavach HUD & Switch to Desktop View */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => {
              soundEffects.playLockOn();
              onOpenKavach();
            }}
            style={{
              background: 'rgba(0, 242, 254, 0.08)',
              border: '1px solid rgba(0, 242, 254, 0.35)',
              borderRadius: '99px',
              padding: '0.24rem 0.55rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              cursor: 'pointer',
              color: '#00f2fe',
              fontSize: '0.66rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)'
            }}
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
            <span>KAVACH 5.2</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playLockOn();
              onExitMobile();
            }}
            title="Switch back to Full Desktop View"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '99px',
              padding: '0.24rem 0.55rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              fontSize: '0.66rem',
              fontWeight: 700
            }}
          >
            <Monitor size={12} color="#38bdf8" />
            <span>Desktop</span>
          </button>
        </div>
      </header>

      {/* ── MOBILE MODE CHIPS BAR ── */}
      <nav className="cyber-mobile-mode-bar">
        <button
          onClick={() => {
            soundEffects.playBeep(false);
            onChangeMode('PIPELINE');
          }}
          className={`cyber-mobile-mode-chip ${activeMode === 'PIPELINE' ? 'active' : ''}`}
        >
          ⚡ Pipeline (Core)
        </button>

        <button
          onClick={() => {
            soundEffects.playBeep(false);
            onChangeMode('ID_FACE_MATCH');
          }}
          className={`cyber-mobile-mode-chip ${activeMode === 'ID_FACE_MATCH' ? 'active' : ''}`}
        >
          👤 ID &amp; Live Match
        </button>

        <button
          onClick={() => {
            soundEffects.playBeep(false);
            onChangeMode('ID_LAB');
          }}
          className={`cyber-mobile-mode-chip ${activeMode === 'ID_LAB' ? 'active' : ''}`}
        >
          📑 ID Lab
        </button>

        <button
          onClick={() => {
            soundEffects.playBeep(false);
            onChangeMode('FACE_LAB');
          }}
          className={`cyber-mobile-mode-chip ${activeMode === 'FACE_LAB' ? 'active' : ''}`}
        >
          🎭 Face Lab
        </button>
      </nav>

      {/* ── HORIZONTAL SWIPEABLE STEPPER TRACK (FOR PIPELINE MODE) ── */}
      {activeMode === 'PIPELINE' && (
        <div className="cyber-mobile-stepper-track">
          {STEP_DEFINITIONS.map((s) => {
            const isActive = currentStep === s.step;
            const isPast = currentStep > s.step;
            return (
              <button
                key={s.step}
                onClick={() => {
                  soundEffects.playBeep(false);
                  onStepClick(s.step);
                }}
                className={`cyber-mobile-step-pill ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}
              >
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── ACTIVE STEP HUD INDICATOR ── */}
      {activeMode === 'PIPELINE' && (
        <div style={{
          padding: '0.45rem 0.95rem 0.25rem 0.95rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)',
          color: '#00f2fe'
        }}>
          <span style={{ fontWeight: 800, letterSpacing: '0.04em' }}>
            STEP 0{currentStep} // {STEP_DEFINITIONS[currentStep - 1]?.title.toUpperCase()}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.66rem' }}>
            {Math.round((currentStep / 7) * 100)}% COMPLETE
          </span>
        </div>
      )}

      {/* ── MAIN CONTENT VIEWPORT (TOUCH-OPTIMIZED RESPONSIVE BODY) ── */}
      <main className="cyber-mobile-content-area mobile-viewport-mode">
        {children}
      </main>

      {/* ── FIXED MOBILE CYBER BOTTOM NAVIGATION DOCK ── */}
      <nav className="cyber-mobile-bottom-dock">
        <button
          onClick={() => {
            soundEffects.playBeep(false);
            onChangeMode('PIPELINE');
          }}
          className={`cyber-dock-item ${activeMode === 'PIPELINE' ? 'active' : ''}`}
        >
          <Scan size={18} />
          <span>Pipeline</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playBeep(false);
            onChangeMode('ID_FACE_MATCH');
          }}
          className={`cyber-dock-item ${activeMode === 'ID_FACE_MATCH' ? 'active' : ''}`}
        >
          <UserCheck size={18} />
          <span>Face Match</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playBeep(false);
            onOpenAuditLog();
          }}
          className="cyber-dock-item"
        >
          <FileText size={18} />
          <span>Audit</span>
          {auditCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '10px',
                background: 'var(--cyan-primary)',
                color: '#050b14',
                fontSize: '0.55rem',
                fontWeight: 900,
                borderRadius: '99px',
                padding: '0.05rem 0.3rem',
                lineHeight: 1
              }}
            >
              {auditCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            soundEffects.playLockOn();
            onOpenKavach();
          }}
          className="cyber-dock-item"
        >
          <ShieldCheck size={18} color="#00f2fe" />
          <span>KAVACH 5.2</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playLockOn();
            onExitMobile();
          }}
          className="cyber-dock-item"
          title="Switch to Desktop Mode"
        >
          <Monitor size={18} color="#38bdf8" />
          <span>Desktop</span>
        </button>
      </nav>
    </div>
  );
};
