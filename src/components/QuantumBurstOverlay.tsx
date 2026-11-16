import React, { useEffect, useRef } from 'react';
import { soundEffects } from '../services/soundEffects';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  rotSpeed: number;
  type: 'shard' | 'spark' | 'hex' | 'dust' | 'tracer';
  length?: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
  lineWidth: number;
}

export const QuantumBurstOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const isRunningRef = useRef<boolean>(false);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const PALETTE = [
      '#00f2fe', // Neon Cyan
      '#38bdf8', // Cyber Sky
      '#6366f1', // Quantum Indigo
      '#a855f7', // Electric Violet
      '#10b981', // Emerald Matrix
      '#ff9933', // Tiranga Saffron Glow
      '#ffffff'  // Pure Core Spark
    ];

    const spawnBurst = (x: number, y: number, count = 140) => {
      // Sound: Sub-bass implosion + crystalline laser crackle
      soundEffects.playQuantumBurst();

      // Shockwave rings with chromatic separation
      shockwavesRef.current.push(
        { x, y, radius: 4, maxRadius: 140, color: 'rgba(0, 242, 254, 0.9)', alpha: 1, lineWidth: 3 },
        { x, y, radius: 2, maxRadius: 95, color: 'rgba(16, 185, 129, 0.85)', alpha: 0.9, lineWidth: 2 },
        { x, y, radius: 1, maxRadius: 50, color: 'rgba(255, 153, 51, 0.85)', alpha: 0.9, lineWidth: 2 }
      );

      // Lakhs of quantum pieces (shards, sparks, geometric nano-chips, tracers)
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        // High-velocity explosion with stratified speed tiers
        const speedTier = Math.random();
        const speed = speedTier > 0.85 ? Math.random() * 18 + 14 : speedTier > 0.4 ? Math.random() * 10 + 6 : Math.random() * 5 + 2;
        const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        const types: Array<'shard' | 'spark' | 'hex' | 'dust' | 'tracer'> = ['shard', 'spark', 'hex', 'dust', 'tracer'];
        const type = types[Math.floor(Math.random() * types.length)];

        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (Math.random() * 3.5),
          size: type === 'shard' ? Math.random() * 8 + 3 : type === 'spark' ? Math.random() * 5 + 2 : Math.random() * 4 + 2,
          length: type === 'tracer' ? Math.random() * 14 + 6 : undefined,
          color,
          alpha: 1,
          decay: Math.random() * 0.022 + 0.012,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.4,
          type
        });
      }

      lastTimeRef.current = performance.now();
      if (!isRunningRef.current) {
        isRunningRef.current = true;
        animate();
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      const now = performance.now();
      const rawDt = (now - lastTimeRef.current) / 16.67;
      lastTimeRef.current = now;
      // Clamp dt so if main-thread yields, physics stays continuous and never freezes in place
      const dt = Math.min(2.5, Math.max(0.3, isNaN(rawDt) ? 1 : rawDt));

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw and update shockwaves (zero-cost stroke, no blur stall)
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += ((sw.maxRadius - sw.radius) * 0.18 + 3.2) * dt;
        sw.alpha -= 0.035 * dt;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwavesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color.replace(/[\d.]+\)$/g, `${Math.max(0, sw.alpha)})`);
        ctx.lineWidth = Math.max(1, sw.lineWidth * (1 - sw.radius / sw.maxRadius));
        ctx.stroke();
        ctx.restore();
      }

      // 2. Draw and update particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const friction = Math.pow(0.94, dt);
        p.vx *= friction; // Air friction
        p.vy = p.vy * friction + 0.16 * dt; // Light downward gravity
        p.rotation += p.rotSpeed * dt;
        p.alpha -= p.decay * dt;

        if (p.alpha <= 0 || p.y > canvas.height + 60 || p.x < -60 || p.x > canvas.width + 60) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;

        if (p.type === 'shard') {
          // Sharp triangular / polygon quantum shattered glass shard
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 1.5);
          ctx.lineTo(p.size * 0.9, p.size * 0.9);
          ctx.lineTo(-p.size * 0.9, p.size * 0.6);
          ctx.closePath();
          ctx.fill();
        } else if (p.type === 'spark') {
          // Elongated high-velocity laser spark
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 2.2, p.size * 0.7, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'tracer') {
          // Linear laser streak tracer (proportional high-tech streak, never stalls across card)
          ctx.beginPath();
          ctx.lineWidth = 1.75;
          ctx.moveTo(0, 0);
          const streakLen = Math.min(50, Math.hypot(p.vx, p.vy) * (p.length || 5));
          const angle = Math.atan2(p.vy, Math.abs(p.vx) > 0.001 ? p.vx : 0.001);
          ctx.lineTo(-Math.cos(angle) * streakLen, -Math.sin(angle) * streakLen);
          ctx.stroke();
        } else if (p.type === 'hex') {
          // Micro futuristic hexagon cyber chip
          ctx.beginPath();
          for (let side = 0; side < 6; side++) {
            const hAngle = (side * Math.PI) / 3;
            const hx = p.size * Math.cos(hAngle);
            const hy = p.size * Math.sin(hAngle);
            if (side === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.fill();
        } else {
          // Glowing quantum dust dot
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (particlesRef.current.length > 0 || shockwavesRef.current.length > 0) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        isRunningRef.current = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    // Global Click Interceptor: Triggers burst on any interactive element click
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = target.closest(
        'button, a, input, select, [role="button"], .btn, summary, .interactive-click, .step-badge, [tabindex="0"]'
      );

      if (isInteractive) {
        const rect = isInteractive.getBoundingClientRect();
        const clickX = e.clientX || rect.left + rect.width / 2;
        const clickY = e.clientY || rect.top + rect.height / 2;
        spawnBurst(clickX, clickY, 140);
      }
    };

    // Custom Event Listener for programmatic bursts
    const handleCustomBurst = (e: Event) => {
      const customEvent = e as CustomEvent<{ x: number; y: number; count?: number }>;
      if (customEvent.detail) {
        spawnBurst(customEvent.detail.x, customEvent.detail.y, customEvent.detail.count || 320);
      }
    };

    // EMP Shield Surge from Kavach
    const handleShieldSurge = () => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      spawnBurst(cx, cy, 380);
    };

    window.addEventListener('click', handleGlobalClick, { capture: true, passive: true });
    window.addEventListener('quantum-burst' as any, handleCustomBurst);
    window.addEventListener('kavach-shield-surge' as any, handleShieldSurge);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleGlobalClick, { capture: true });
      window.removeEventListener('quantum-burst' as any, handleCustomBurst);
      window.removeEventListener('kavach-shield-surge' as any, handleShieldSurge);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

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
        zIndex: 99999
      }}
    />
  );
};
