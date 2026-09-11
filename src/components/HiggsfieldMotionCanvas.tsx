import React, { useEffect, useRef, useState } from 'react';

export type HiggsfieldMode = 'TIRANGA' | 'SYNTHESIS' | 'QUANTUM' | 'NATURE' | 'CYBER';
export type CanvasMode = HiggsfieldMode;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  type: 'quantum' | 'spore' | 'cyber' | 'tiranga';
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
}

export interface HiggsfieldMotionCanvasProps {
  initialMode?: HiggsfieldMode;
  mode?: HiggsfieldMode;
}

export const HiggsfieldMotionCanvas: React.FC<HiggsfieldMotionCanvasProps> = ({
  initialMode = 'SYNTHESIS',
  mode
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeMode, setActiveMode] = useState<HiggsfieldMode>(mode || initialMode);

  useEffect(() => {
    if (mode) {
      setActiveMode(mode);
    }
  }, [mode]);

  const mouseRef = useRef<{ x: number; y: number; isHovering: boolean }>({
    x: -1000,
    y: -1000,
    isHovering: false
  });
  const shockwavesRef = useRef<Shockwave[]>([]);

  useEffect(() => {
    const handleModeChange = (e: CustomEvent<HiggsfieldMode>) => {
      if (e.detail) setActiveMode(e.detail);
    };

    const handleShockwave = (e: CustomEvent<{ x?: number; y?: number; color?: string }>) => {
      const canvas = canvasRef.current;
      const x = e.detail?.x ?? (canvas ? canvas.width / 2 : window.innerWidth / 2);
      const y = e.detail?.y ?? (canvas ? canvas.height / 2 : window.innerHeight / 2);
      shockwavesRef.current.push({
        x,
        y,
        radius: 10,
        maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.75,
        color: e.detail?.color || '#00f2fe',
        alpha: 0.8
      });
    };

    window.addEventListener('higgsfield-mode', handleModeChange as EventListener);
    window.addEventListener('higgsfield-pulse', handleShockwave as EventListener);

    return () => {
      window.removeEventListener('higgsfield-mode', handleModeChange as EventListener);
      window.removeEventListener('higgsfield-pulse', handleShockwave as EventListener);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.isHovering = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Particle Palettes
    const tirangaColors = ['#FF9933', '#FFAA44', '#FFFFFF', '#F1F5F9', '#138808', '#1AA20B', '#000080'];
    const quantumColors = ['#00f2fe', '#38bdf8', '#818cf8', '#c084fc', '#06b6d4'];
    const natureColors = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#fbbf24'];
    const cyberColors = ['#00f2fe', '#3b82f6', '#6366f1', '#06b6d4'];

    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(105, Math.floor((width * height) / 14000));

      for (let i = 0; i < particleCount; i++) {
        let type: 'quantum' | 'spore' | 'cyber' | 'tiranga' = 'quantum';
        let palette = quantumColors;

        if (activeMode === 'TIRANGA') {
          type = 'tiranga';
          palette = tirangaColors;
        } else if (activeMode === 'SYNTHESIS') {
          if (i % 4 === 0) {
            type = 'tiranga';
            palette = tirangaColors;
          } else if (i % 3 === 0) {
            type = 'spore';
            palette = natureColors;
          } else if (i % 2 === 0) {
            type = 'cyber';
            palette = cyberColors;
          }
        } else if (activeMode === 'NATURE') {
          type = 'spore';
          palette = natureColors;
        } else if (activeMode === 'CYBER') {
          type = 'cyber';
          palette = cyberColors;
        }

        const color = palette[Math.floor(Math.random() * palette.length)];
        const baseRadius = type === 'spore' ? 1.5 + Math.random() * 2.5 : 1.2 + Math.random() * 2.0;

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (type === 'spore' ? 0.4 : 0.8),
          vy: type === 'spore' ? -(0.25 + Math.random() * 0.5) : (Math.random() - 0.5) * 0.8,
          radius: baseRadius,
          baseRadius,
          color,
          alpha: 0.3 + Math.random() * 0.6,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          type
        });
      }
    };

    initParticles();

    // Perspective Cyber Grid Variables
    let gridOffset = 0;
    let scanlineY = 0;
    let telemetryTimer = 0;
    const telemetryCodes = [
      'SYS://HIGGSFIELD.QUANTUM_CORE',
      'ASTRA-6://888_DENSE_LANDMARKS',
      'NEURAL_GRAVITY_WAVE: ACTIVE',
      'ICAO_9303.SECURE_SUITE: V2.5',
      'ENTROPY_FLUX: 0.00142_NOMINAL',
      'BIOMETRIC_RESOLUTION: 888_DOTS'
    ];
    let currentTelemetry = telemetryCodes[0];

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // ── 0. 🇮🇳 Indian National Tricolor (Tiranga) Ambient Waves ──
      if (activeMode === 'TIRANGA' || activeMode === 'SYNTHESIS') {
        ctx.save();
        const ribbonY = height * 0.22;
        const waveSpeed = time * 0.002;

        // Saffron wave
        ctx.beginPath();
        for (let x = 0; x <= width; x += 8) {
          const y = ribbonY + Math.sin(x * 0.003 + waveSpeed) * 35 + Math.cos(x * 0.007 + waveSpeed * 1.5) * 15;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(255, 153, 51, 0.28)';
        ctx.lineWidth = 4;
        ctx.stroke();

        // White wave
        ctx.beginPath();
        for (let x = 0; x <= width; x += 8) {
          const y = ribbonY + 18 + Math.sin(x * 0.003 + waveSpeed) * 35 + Math.cos(x * 0.007 + waveSpeed * 1.5) * 15;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Green wave
        ctx.beginPath();
        for (let x = 0; x <= width; x += 8) {
          const y = ribbonY + 36 + Math.sin(x * 0.003 + waveSpeed) * 35 + Math.cos(x * 0.007 + waveSpeed * 1.5) * 15;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(19, 136, 8, 0.28)';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.restore();
      }

      // ── 1. Cybernetic Perspective Grid (Bottom 35% of Screen) ──
      if (activeMode === 'CYBER' || activeMode === 'SYNTHESIS') {
        ctx.save();
        const horizon = height * 0.65;
        const gridHeight = height - horizon;

        // Perspective floor gradient
        const gridGrad = ctx.createLinearGradient(0, horizon, 0, height);
        gridGrad.addColorStop(0, 'rgba(0, 242, 254, 0.0)');
        gridGrad.addColorStop(0.5, 'rgba(0, 242, 254, 0.03)');
        gridGrad.addColorStop(1, 'rgba(0, 242, 254, 0.08)');
        ctx.fillStyle = gridGrad;
        ctx.fillRect(0, horizon, width, gridHeight);

        // Perspective converging vertical lines
        const vanishingX = width / 2;
        const vanishingY = horizon;
        const lineCount = 18;
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.05)';
        ctx.lineWidth = 1;

        for (let i = -lineCount / 2; i <= lineCount / 2; i++) {
          const bottomX = vanishingX + (i * width) / (lineCount * 0.5);
          ctx.beginPath();
          ctx.moveTo(vanishingX, vanishingY);
          ctx.lineTo(bottomX, height);
          ctx.stroke();
        }

        // Horizontal moving depth gridlines
        gridOffset = (gridOffset + 0.35) % 30;
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.04)';
        for (let y = horizon; y < height; y += 15) {
          const progress = (y - horizon) / gridHeight;
          const exponentialY = horizon + Math.pow(progress, 1.8) * gridHeight + gridOffset * progress;
          if (exponentialY <= height) {
            ctx.beginPath();
            ctx.moveTo(0, exponentialY);
            ctx.lineTo(width, exponentialY);
            ctx.stroke();
          }
        }

        // Horizontal laser scanning sweep
        scanlineY = (scanlineY + 1.2) % height;
        const laserGrad = ctx.createLinearGradient(0, scanlineY - 20, 0, scanlineY + 20);
        laserGrad.addColorStop(0, 'rgba(0, 242, 254, 0)');
        laserGrad.addColorStop(0.5, 'rgba(0, 242, 254, 0.12)');
        laserGrad.addColorStop(1, 'rgba(0, 242, 254, 0)');
        ctx.fillStyle = laserGrad;
        ctx.fillRect(0, scanlineY - 20, width, 40);

        ctx.restore();
      }

      // ── 2. Quantum Higgsfield Filaments / Particle Connections ──
      const connectDist = activeMode === 'QUANTUM' || activeMode === 'SYNTHESIS' ? 120 : 70;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectDist) {
            const alpha = (1 - dist / connectDist) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // ── 3. Particle Evolution, Gravitational Pull & Nature Wind ──
      particles.forEach(p => {
        p.pulsePhase += p.pulseSpeed;
        const pulse = 1 + Math.sin(p.pulsePhase) * 0.35;
        p.radius = p.baseRadius * pulse;

        // Nature spores: gentle horizontal swaying like pollen/spores in a breeze
        if (p.type === 'spore') {
          p.x += Math.sin(time * 0.0015 + p.pulsePhase) * 0.45 + p.vx;
          p.y += p.vy;
          if (p.y < -20) {
            p.y = height + 20;
            p.x = Math.random() * width;
          }
        } else {
          // Quantum / Cyber particles: standard momentum
          p.x += p.vx;
          p.y += p.vy;

          // Screen wrap
          if (p.x < 0) p.x = width;
          else if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          else if (p.y > height) p.y = 0;
        }

        // Higgsfield Gravitational Wave Interaction with Mouse
        if (mouseRef.current.isHovering) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 220;

          if (dist < maxDist && dist > 5) {
            const force = (1 - dist / maxDist) * 0.8;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
            p.radius = p.baseRadius * (1 + (1 - dist / maxDist) * 0.8);
          }
        }

        // Render glowing particle halo (Higgsfield chromatic emission)
        const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3.5);
        radGrad.addColorStop(0, p.color);
        radGrad.addColorStop(0.4, p.color + '44');
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = radGrad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      });

      // ── 4. Shockwave Ripples (Function execution energy pulse) ──
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += 14;
        sw.alpha *= 0.96;

        if (sw.radius < sw.maxRadius && sw.alpha > 0.02) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 242, 254, ${sw.alpha})`;
          ctx.lineWidth = 3;
          ctx.shadowColor = '#00f2fe';
          ctx.shadowBlur = 18;
          ctx.stroke();

          // Second inner echo ring
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, Math.max(0, sw.radius - 25), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(16, 185, 129, ${sw.alpha * 0.7})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        } else {
          shockwavesRef.current.splice(i, 1);
        }
      }

      // ── 5. Futuristic Cyber Telemetry Watermark (Subtle HUD readout) ──
      telemetryTimer++;
      if (telemetryTimer % 240 === 0) {
        currentTelemetry = telemetryCodes[Math.floor(Math.random() * telemetryCodes.length)];
      }

      ctx.save();
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.fillText(`⚡ ${currentTelemetry} | FPS: 60 | HIGGSFIELD: ACTIVE`, 24, height - 20);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [activeMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.95
      }}
    />
  );
};
