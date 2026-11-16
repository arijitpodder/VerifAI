import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Terminal,
  Zap,
  X,
  Radio
} from 'lucide-react';
import { kavachSecurityEngine } from '../services/kavachSecurityEngine';
import type { KavachSystemTelemetry } from '../services/kavachSecurityEngine';
import { soundEffects } from '../services/soundEffects';

interface KavachSecurityModalProps {
  onClose: () => void;
}

export const KavachSecurityModal: React.FC<KavachSecurityModalProps> = ({ onClose }) => {
  const [telemetry, setTelemetry] = useState<KavachSystemTelemetry>(() =>
    kavachSecurityEngine.getTelemetry()
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState('');
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(kavachSecurityEngine.getTelemetry());
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleStartDeepScan = async () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanResult(null);
    soundEffects.playKavachShieldPulse();

    const result = await kavachSecurityEngine.runDeepThreatScan((pct, stepName) => {
      setScanProgress(pct);
      setScanStep(stepName);
      soundEffects.playLockOn();
    });

    setIsScanning(false);
    setScanResult(result.scanSummary);
    setTelemetry(kavachSecurityEngine.getTelemetry());
    soundEffects.playThreatNeutralized();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 17, 0.88)',
        backdropFilter: 'blur(16px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="kavach-cyber-modal"
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: 'linear-gradient(180deg, #090e1c 0%, #050813 100%)',
          border: '1px solid rgba(0, 242, 254, 0.45)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 0 50px rgba(0, 242, 254, 0.25), inset 0 0 30px rgba(0, 242, 254, 0.05)',
          position: 'relative'
        }}
      >
        {/* Futuristic Cyber Laser Scanline at Modal Top */}
        <div
          style={{
            height: '3px',
            background: 'linear-gradient(90deg, #00f2fe 0%, #10b981 50%, #a855f7 100%)',
            boxShadow: '0 0 14px #00f2fe'
          }}
        />

        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid rgba(0, 242, 254, 0.2)',
            background: 'rgba(6, 12, 26, 0.6)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(0, 242, 254, 0.15)',
                border: '1px solid #00f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(0, 242, 254, 0.4)'
              }}
            >
              <ShieldCheck size={24} color="#00f2fe" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    color: '#ffffff',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  KAVACH 5.2 // DEFENSE GRID
                </h2>
                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid #10b981',
                    color: '#10b981',
                    padding: '0.1rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.68rem',
                    fontWeight: 800
                  }}
                >
                  ARMED &amp; ZERO TRUST
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, fontFamily: 'var(--font-mono)' }}>
                SYS://YEAR-2080.SEC_ARCH • AUTONOMOUS AI ANTI-TAMPER MATRIX
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '0.45rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem 1.75rem' }}>
          {/* Quick Metrics HUD */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}
          >
            <div
              style={{
                background: 'rgba(0, 242, 254, 0.05)',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem 1rem'
              }}
            >
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                DEFENSE STATUS
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>
                OPTIMAL (100%)
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.2rem' }}>
                Zero intrusion vectors
              </div>
            </div>

            <div
              style={{
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem 1rem'
              }}
            >
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                BUGS TRAPPED &amp; HEALED
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>
                {telemetry.bugsNeutralized} (0% CRASH)
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.2rem' }}>
                Autonomous self-healing
              </div>
            </div>

            <div
              style={{
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem 1rem'
              }}
            >
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                HACK ATTEMPTS BLOCKED
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#00f2fe', marginTop: '0.2rem' }}>
                {telemetry.hackerAttemptsBlocked} NEUTRALIZED
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.2rem' }}>
                DOM &amp; script injections locked
              </div>
            </div>

            <div
              style={{
                background: 'rgba(168, 85, 247, 0.05)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem 1rem'
              }}
            >
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                MEMORY INTEGRITY
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#a855f7', marginTop: '0.2rem' }}>
                IMMUTABLE
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.2rem' }}>
                Prototypes sealed &amp; sandboxed
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 153, 51, 0.05)',
                border: '1px solid rgba(255, 153, 51, 0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem 1rem'
              }}
            >
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                CONSENSUS SIGNATURE
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ff9933', marginTop: '0.2rem' }}>
                SHA-256 HMAC
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.2rem' }}>
                {telemetry.payloadsVerified} vectors signed
              </div>
            </div>
          </div>

          {/* Deep AI Threat Scan & EMP Action Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid rgba(0, 242, 254, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Radio size={16} color="#00f2fe" style={{ animation: 'radarPulse 1.5s infinite' }} />
                  KAVACH 5.2 Deep AI Autonomous Threat &amp; Bug Defense Grid
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                  Multi-vector probe across DOM trees, prototype states, memory boundaries, and AI gateways.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    kavachSecurityEngine.pulseDefenseBarrier();
                    setTelemetry(kavachSecurityEngine.getTelemetry());
                  }}
                  style={{
                    padding: '0.5rem 0.95rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0, 242, 254, 0.15)',
                    border: '1px solid #00f2fe',
                    color: '#00f2fe',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 0 12px rgba(0, 242, 254, 0.25)'
                  }}
                  title="Deploy Full-Screen Quantum EMP Shield Wave"
                >
                  <Zap size={14} />
                  <span>Pulse EMP Shield</span>
                </button>

                <button
                  onClick={handleStartDeepScan}
                  disabled={isScanning}
                  style={{
                    padding: '0.5rem 1.15rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isScanning ? 'rgba(0, 242, 254, 0.2)' : 'linear-gradient(135deg, #00f2fe, #10b981)',
                    color: '#050b14',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    border: 'none',
                    cursor: isScanning ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)'
                  }}
                >
                  <ShieldCheck size={15} />
                  <span>{isScanning ? 'SCANNING DEFENSE GRID...' : 'Initiate Deep Threat Scan'}</span>
                </button>
              </div>
            </div>

            {/* Scan Progress Bar & Step Text */}
            {isScanning && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#00f2fe', fontFamily: 'var(--font-mono)', marginBottom: '0.35rem' }}>
                  <span>&gt; {scanStep}</span>
                  <span>{scanProgress}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${scanProgress}%`,
                      background: 'linear-gradient(90deg, #00f2fe, #10b981)',
                      boxShadow: '0 0 10px #00f2fe',
                      transition: 'width 0.25s linear'
                    }}
                  />
                </div>
              </div>
            )}

            {scanResult && !isScanning && (
              <div
                style={{
                  marginTop: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '4px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#10b981',
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                <CheckCircle2 size={16} />
                <span>{scanResult}</span>
              </div>
            )}
          </div>

          {/* 6 Defense Modules Grid */}
          <h3
            style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              marginBottom: '0.85rem',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <ShieldAlert size={14} color="#00f2fe" />
            Active Defense Nodes (6/6 Operational)
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '0.85rem',
              marginBottom: '1.5rem'
            }}
          >
            {telemetry.nodes.map((node) => (
              <div
                key={node.id}
                style={{
                  background: 'rgba(10, 17, 34, 0.7)',
                  border: '1px solid rgba(0, 242, 254, 0.15)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.68rem', color: '#00f2fe', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    {node.codename}
                  </span>
                  <span
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '3px',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      padding: '0.05rem 0.35rem'
                    }}
                  >
                    {node.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#ffffff' }}>
                  {node.name}
                </div>

                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  {node.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.35rem',
                    paddingTop: '0.45rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    fontSize: '0.66rem',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  <span>Integrity: {node.integrity}%</span>
                  <span style={{ color: '#00f2fe' }}>{node.lastCheck}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Defense Telemetry Audit Logs */}
          <h3
            style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Terminal size={14} color="#10b981" />
            Live Security Audit Feed
          </h3>

          <div
            style={{
              background: '#040711',
              border: '1px solid rgba(0, 242, 254, 0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem',
              maxHeight: '160px',
              overflowY: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}
          >
            {telemetry.recentLogs.map((log) => (
              <div key={log.id} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <span style={{ color: '#64748b', whiteSpace: 'nowrap' }}>[{log.timestamp}]</span>
                <span
                  style={{
                    color:
                      log.level === 'SHIELD'
                        ? '#00f2fe'
                        : log.level === 'NEUTRALIZE'
                        ? '#ef4444'
                        : log.level === 'AUDIT'
                        ? '#a855f7'
                        : '#10b981',
                    fontWeight: 700,
                    whiteSpace: 'nowrap'
                  }}
                >
                  [{log.module}]
                </span>
                <span style={{ color: '#cbd5e1' }}>{log.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.75rem',
            borderTop: '1px solid rgba(0, 242, 254, 0.2)',
            background: 'rgba(6, 12, 26, 0.6)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <div>
            KAVACH 5.2 ENCRYPTION: SHA-256 HMAC / AES-256-GCM READY
          </div>
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 1rem', fontSize: '0.78rem' }}
          >
            Close Sentry HUD
          </button>
        </div>
      </div>
    </div>
  );
};
