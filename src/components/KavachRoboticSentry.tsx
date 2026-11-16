import React, { useState, useEffect, useRef } from 'react';
import { Zap, Maximize2, Minimize2 } from 'lucide-react';
import { kavachSecurityEngine } from '../services/kavachSecurityEngine';
import type { KavachSystemTelemetry } from '../services/kavachSecurityEngine';
import { soundEffects } from '../services/soundEffects';

interface KavachRoboticSentryProps {
  onOpenModal: () => void;
}

export const KavachRoboticSentry: React.FC<KavachRoboticSentryProps> = ({ onOpenModal }) => {
  const [telemetry, setTelemetry] = useState<KavachSystemTelemetry>(() =>
    kavachSecurityEngine.getTelemetry()
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isSurging, setIsSurging] = useState<boolean>(false);
  const [eyeOffset, setEyeOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const droneRef = useRef<HTMLDivElement | null>(null);

  // Poll telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(kavachSecurityEngine.getTelemetry());
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Robotic Eye tracking cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!droneRef.current) return;
      const rect = droneRef.current.getBoundingClientRect();
      const droneCenterX = rect.left + rect.width / 2;
      const droneCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - droneCenterX;
      const deltaY = e.clientY - droneCenterY;
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(6, Math.hypot(deltaX, deltaY) / 60);

      setEyeOffset({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Deploy Shield Barrier Surge
  const handleDeployShield = () => {
    soundEffects.playRoboticServo();
    setIsSurging(true);
    kavachSecurityEngine.pulseDefenseBarrier();

    setTimeout(() => {
      setIsSurging(false);
    }, 1200);
  };

  return (
    <>
      {/* Full-Screen EMP Shield Wave (when triggered) */}
      {isSurging && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 999998,
            animation: 'kavachEmpWave 1.2s cubic-bezier(0.1, 0.9, 0.2, 1) forwards'
          }}
        />
      )}

      {/* Floating Robotic Sentry Drone Container */}
      <div
        ref={droneRef}
        className="robotic-sentry-widget"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.65rem',
          pointerEvents: 'auto'
        }}
      >
        {isExpanded ? (
          /* Expanded Robotic Sentry HUD */
          <div
            style={{
              width: '320px',
              background: 'linear-gradient(135deg, rgba(6, 12, 26, 0.94) 0%, rgba(4, 8, 18, 0.96) 100%)',
              border: '1px solid rgba(0, 242, 254, 0.4)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 0 35px rgba(0, 242, 254, 0.25), inset 0 0 20px rgba(0, 242, 254, 0.05)',
              padding: '0.95rem 1.1rem',
              backdropFilter: 'blur(20px)',
              position: 'relative',
              overflow: 'hidden'
            }}
            className="cyber-2080-card"
          >
            {/* Top Laser Scanline */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #00f2fe, #10b981, transparent)',
                animation: 'scanlineMove 2.2s linear infinite'
              }}
            />

            {/* Header: Mechanical Eye + Title + Minimize */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {/* 2080 Robotic Gyro Eye */}
                <div
                  style={{
                    position: 'relative',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Outer Mechanical Notched Ring */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      border: '1.5px dashed #00f2fe',
                      animation: 'spinClockwise 6s linear infinite'
                    }}
                  />
                  {/* Inner Gyro Ring */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '4px',
                      borderRadius: '50%',
                      border: '1px dashed #10b981',
                      animation: 'spinCounterClockwise 3.5s linear infinite'
                    }}
                  />
                  {/* Tracking Pupil Optical Lens */}
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #ffffff 10%, #00f2fe 70%, #06b6d4 100%)',
                      boxShadow: '0 0 10px #00f2fe, 0 0 18px rgba(0, 242, 254, 0.8)',
                      transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                      transition: 'transform 0.08s ease-out'
                    }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        color: '#ffffff',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.04em'
                      }}
                    >
                      KAVACH 5.2 SENTRY
                    </span>
                    <span
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        border: '1px solid #10b981',
                        color: '#10b981',
                        fontSize: '0.58rem',
                        fontWeight: 800,
                        padding: '0.05rem 0.35rem',
                        borderRadius: '3px'
                      }}
                    >
                      ACTIVE
                    </span>
                  </div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    SYS://YEAR-2080 • AUTONOMOUS
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setIsExpanded(false);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.2rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Minimize Sentry Drone"
              >
                <Minimize2 size={14} />
              </button>
            </div>

            {/* Real-time Defense Status Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                marginBottom: '0.8rem',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <div
                style={{
                  background: 'rgba(0, 242, 254, 0.06)',
                  border: '1px solid rgba(0, 242, 254, 0.2)',
                  borderRadius: '4px',
                  padding: '0.45rem 0.55rem'
                }}
              >
                <div style={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>BUGS TRAPPED</div>
                <div style={{ color: '#10b981', fontWeight: 800, fontSize: '0.85rem' }}>
                  {telemetry.bugsNeutralized} (0% CRASH)
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.06)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '4px',
                  padding: '0.45rem 0.55rem'
                }}
              >
                <div style={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>HACK VECTORS</div>
                <div style={{ color: '#00f2fe', fontWeight: 800, fontSize: '0.85rem' }}>
                  0 PERMITTED
                </div>
              </div>
            </div>

            {/* Action Buttons: Deploy Shield & Expand Modal */}
            <div style={{ display: 'flex', gap: '0.45rem' }}>
              <button
                onClick={handleDeployShield}
                disabled={isSurging}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 242, 254, 0.6)',
                  background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.25) 0%, rgba(16, 185, 129, 0.2) 100%)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: isSurging ? 'wait' : 'pointer',
                  fontFamily: 'var(--font-mono)',
                  boxShadow: '0 0 12px rgba(0, 242, 254, 0.3)',
                  transition: 'all 0.2s'
                }}
                className="btn-cyber-2080"
              >
                <Zap size={13} color="#00f2fe" />
                <span>{isSurging ? 'SURGING...' : 'PULSE SHIELD'}</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playKavachShieldPulse();
                  onOpenModal();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                title="Open Complete KAVACH 5.2 Control Center"
              >
                <Maximize2 size={13} />
              </button>
            </div>
          </div>
        ) : (
          /* Minimized Floating Robotic Orb Button */
          <button
            onClick={() => {
              soundEffects.playRoboticServo();
              setIsExpanded(true);
            }}
            style={{
              position: 'relative',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #091326 0%, #030712 100%)',
              border: '2px solid #00f2fe',
              boxShadow: '0 0 25px rgba(0, 242, 254, 0.5), inset 0 0 15px rgba(0, 242, 254, 0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="kavach-floating-orb"
            title="KAVACH 5.2 AI Robotic Sentry (Click to expand)"
          >
            {/* Outer Rotating Gear */}
            <div
              style={{
                position: 'absolute',
                inset: '-4px',
                borderRadius: '50%',
                border: '1.5px dashed rgba(0, 242, 254, 0.6)',
                animation: 'spinClockwise 5s linear infinite'
              }}
            />

            {/* Glowing Eye Lens */}
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #ffffff 10%, #00f2fe 65%, #06b6d4 100%)',
                boxShadow: '0 0 14px #00f2fe',
                transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                transition: 'transform 0.08s ease-out'
              }}
            />

            {/* Status Beacon Dot */}
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
                animation: 'radarPulse 1.8s infinite'
              }}
            />
          </button>
        )}
      </div>
    </>
  );
};
