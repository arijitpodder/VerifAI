import React, { useEffect, useRef } from 'react';

interface LaserScanOverlayProps {
  active: boolean;
  label?: string;
}

export const LaserScanOverlay: React.FC<LaserScanOverlayProps> = ({ active, label = 'OPTICAL MATRIX SCAN' }) => {
  if (!active) return null;

  return (
    <div className="laser-scan-container" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 30, overflow: 'hidden' }}>
      {/* High-tech Laser Beam Sweep */}
      <div className="laser-scan-beam" />

      {/* Cybernetic Grid Mask */}
      <div className="laser-grid-overlay" />

      {/* Corner Brackets */}
      <div style={{ position: 'absolute', top: 6, left: 6, width: 16, height: 16, borderTop: '2px solid #00f2fe', borderLeft: '2px solid #00f2fe' }} />
      <div style={{ position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderTop: '2px solid #00f2fe', borderRight: '2px solid #00f2fe' }} />
      <div style={{ position: 'absolute', bottom: 6, left: 6, width: 16, height: 16, borderBottom: '2px solid #00f2fe', borderLeft: '2px solid #00f2fe' }} />
      <div style={{ position: 'absolute', bottom: 6, right: 6, width: 16, height: 16, borderBottom: '2px solid #00f2fe', borderRight: '2px solid #00f2fe' }} />

      {/* Dynamic Telemetry Badge */}
      <div style={{
        position: 'absolute',
        bottom: 8,
        left: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 8px',
        borderRadius: 4,
        background: 'rgba(3, 7, 18, 0.88)',
        border: '1px solid rgba(0, 242, 254, 0.4)',
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        color: '#00f2fe'
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00f2fe', boxShadow: '0 0 8px #00f2fe' }} />
        <span>{label}</span>
      </div>
    </div>
  );
};

interface RoboticCameraHudProps {
  isLocked?: boolean;
}

export const RoboticCameraHud: React.FC<RoboticCameraHudProps> = ({ isLocked = false }) => {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 25, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer Rotating Gyro Reticle */}
      <div style={{ position: 'relative', width: '240px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Outer dashed ring */}
        <div
          className="reticle-spin-cw"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '1.5px dashed rgba(0, 242, 254, 0.4)'
          }}
        />

        {/* Counter-rotating segmented ring */}
        <div
          className="reticle-spin-ccw"
          style={{
            position: 'absolute',
            inset: '12px',
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#00f2fe',
            borderBottomColor: '#a855f7'
          }}
        />

        {/* Target Reticle Brackets */}
        <div style={{ position: 'absolute', inset: '28px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 14, height: 14, borderTop: '2px solid #00f2fe', borderLeft: '2px solid #00f2fe' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: 14, height: 14, borderTop: '2px solid #00f2fe', borderRight: '2px solid #00f2fe' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 14, height: 14, borderBottom: '2px solid #00f2fe', borderLeft: '2px solid #00f2fe' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderBottom: '2px solid #00f2fe', borderRight: '2px solid #00f2fe' }} />
        </div>

        {/* Crosshair Center */}
        <div style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: isLocked ? '#10b981' : '#00f2fe',
          boxShadow: isLocked ? '0 0 12px #10b981' : '0 0 12px #00f2fe'
        }} />

        {/* Status Text Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '-34px',
          padding: '3px 10px',
          borderRadius: 4,
          background: 'rgba(3, 7, 18, 0.9)',
          border: `1px solid ${isLocked ? 'rgba(16, 185, 129, 0.6)' : 'rgba(0, 242, 254, 0.4)'}`,
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.08em',
          color: isLocked ? '#34d399' : '#38bdf8',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          <span style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: isLocked ? '#10b981' : '#00f2fe'
          }} />
          <span>{isLocked ? 'TARGET LOCK: ACQUIRED' : 'AI TARGETING // ACTIVE'}</span>
        </div>
      </div>
    </div>
  );
};

interface SynapticMatchBridgeProps {
  isMatching: boolean;
}

export const SynapticMatchBridge: React.FC<SynapticMatchBridgeProps> = ({ isMatching }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isMatching) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.05;
      const w = (canvas.width = canvas.parentElement?.clientWidth || 300);
      const h = (canvas.height = canvas.parentElement?.clientHeight || 60);

      ctx.clearRect(0, 0, w, h);

      // Draw flowing sine waves between left and right (Tricolor + Cyan energy waves)
      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, '#ff9933'); // Saffron
        grad.addColorStop(0.35, '#00f2fe'); // Cyan
        grad.addColorStop(0.65, '#ffffff'); // White
        grad.addColorStop(1, '#138808'); // Emerald Green
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.5;

        for (let x = 0; x < w; x += 4) {
          const freq = 0.03 + wave * 0.01;
          const amp = 14 + wave * 6;
          const y = h / 2 + Math.sin(x * freq + t * (wave + 1)) * amp * Math.sin((x / w) * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Energy sparks traveling across
      for (let i = 0; i < 6; i++) {
        const sparkX = ((t * 80 + i * (w / 6)) % w);
        const sparkY = h / 2 + Math.sin(sparkX * 0.04 + t) * 14 * Math.sin((sparkX / w) * Math.PI);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(sparkX, sparkY, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(0, 242, 254, 0.5)';
        ctx.beginPath();
        ctx.arc(sparkX, sparkY, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isMatching]);

  if (!isMatching) return null;

  return (
    <div style={{
      width: '100%',
      margin: '0.75rem 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '0.5rem 0',
      borderRadius: 'var(--radius-md)',
      background: 'rgba(3, 7, 18, 0.75)',
      border: '1px solid rgba(0, 242, 254, 0.35)',
      boxShadow: '0 0 20px rgba(0, 242, 254, 0.15)'
    }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '52px', display: 'block' }} />
      <div style={{
        fontSize: '11px',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.08em',
        color: '#38bdf8',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00f2fe' }} />
        <span>QUANTUM SYNAPTIC BIOMETRIC VECTOR COMPARISON IN PROGRESS</span>
      </div>
    </div>
  );
};
