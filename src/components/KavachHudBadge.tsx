import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface KavachHudBadgeProps {
  onClick: () => void;
}

export const KavachHudBadge: React.FC<KavachHudBadgeProps> = ({ onClick }) => {
  const handleClick = () => {
    soundEffects.playKavachShieldPulse();
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      title="KAVACH 5.2 — AI Cyber Defense System (Click to inspect security telemetry)"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.35rem 0.75rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid rgba(0, 242, 254, 0.45)',
        background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 16px rgba(0, 242, 254, 0.25)',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className="kavach-hud-pill"
    >
      {/* Sci-fi scanner line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #00f2fe, #10b981, transparent)',
          animation: 'scanlineMove 2.5s linear infinite'
        }}
      />

      {/* Pulsing Shield Radar */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ShieldCheck size={16} color="#00f2fe" style={{ filter: 'drop-shadow(0 0 6px #00f2fe)' }} />
        <span
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10b981',
            top: '-2px',
            right: '-3px',
            boxShadow: '0 0 8px #10b981',
            animation: 'radarPulse 1.8s infinite'
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            fontFamily: 'var(--font-mono)',
            background: 'linear-gradient(90deg, #ffffff, #00f2fe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          KAVACH 5.2
        </span>
        <span
          style={{
            fontSize: '0.62rem',
            fontWeight: 800,
            padding: '0.1rem 0.4rem',
            borderRadius: '4px',
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            color: '#10b981',
            letterSpacing: '0.04em'
          }}
        >
          100% SECURE
        </span>
      </div>
    </button>
  );
};
