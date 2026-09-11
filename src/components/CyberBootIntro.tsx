import React, { useEffect, useRef, useState } from 'react';
import { dhurandharAudio } from '../services/dhurandharAudioService';
import { soundEffects } from '../services/soundEffects';
import { Play, Pause, ArrowRight } from 'lucide-react';

interface CyberBootIntroProps {
  onComplete: () => void;
}

interface VideoScene {
  id: string;
  image: string;
  title: string;
  badge: string;
  subtitle: string;
  icon: string;
  highlightColor: string;
}

export const CyberBootIntro: React.FC<CyberBootIntroProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isDismissing, setIsDismissing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(dhurandharAudio.isMusicPlaying());
  const [progress, setProgress] = useState(0);

  const getAssetPath = (path: string) => {
    const base = (import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : './';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${cleanBase}${cleanPath}`;
  };

  // 🇮🇳 5 Iconic Development Scenes of India
  const scenes: VideoScene[] = [
    {
      id: 'tiger',
      image: getAssetPath('images/viksit_bharat_tiger.jpg'),
      title: 'ROYAL BENGAL TIGER OF INDIA',
      badge: 'NATIONAL ANIMAL & IDENTITY',
      subtitle: 'Symbol of sovereign strength, quantum resilience & national pride.',
      icon: '🐅',
      highlightColor: '#ff9933'
    },
    {
      id: 'fighter_jets',
      image: getAssetPath('images/indian_fighter_jets.jpg'),
      title: 'INDIAN AIR FORCE FIGHTER JETS',
      badge: 'SUPERSONIC DEFENSE SUPREMACY',
      subtitle: 'Indigenous Tejas & Rafale soaring at supersonic speeds with sonic boom condensation.',
      icon: '✈️',
      highlightColor: '#00f2fe'
    },
    {
      id: 'vande_bharat',
      image: getAssetPath('images/vande_bharat_future.jpg'),
      title: 'VANDE BHARAT & BULLET RAIL',
      badge: 'HIGH-SPEED INDIGENOUS TRANSIT',
      subtitle: 'Next-generation high-speed viaduct corridors connecting a developed Viksit Bharat.',
      icon: '🚄',
      highlightColor: '#38bdf8'
    },
    {
      id: 'statue_of_unity',
      image: getAssetPath('images/statue_of_unity.jpg'),
      title: 'STATUE OF UNITY (182 METERS)',
      badge: 'WORLD’S TALLEST STATUE',
      subtitle: 'The world’s tallest statue illuminated by tricolor laser searchlights over Narmada.',
      icon: '🗿',
      highlightColor: '#10b981'
    },
    {
      id: 'isro_rocket',
      image: getAssetPath('images/isro_space_rocket.jpg'),
      title: 'ISRO SPACE EXPLORATION & GAGANYAAN',
      badge: 'DEEP SPACE SUPREMACY',
      subtitle: 'Chandrayaan lunar exploration & Gaganyaan human spaceflight blasting into the cosmos.',
      icon: '🚀',
      highlightColor: '#f59e0b'
    }
  ];

  // Subscribe to audio state
  useEffect(() => {
    const unsub = dhurandharAudio.subscribe((playing) => {
      setIsPlayingAudio(playing);
    });
    return () => {
      unsub();
    };
  }, []);

  // Preload all 5 development showcase images immediately on mount
  useEffect(() => {
    scenes.forEach((scene) => {
      const img = new Image();
      img.src = scene.image;
    });
  }, []);

  // Automatic audio start & Fast scene progression loop
  useEffect(() => {
    try {
      dhurandharAudio.startMusic();
    } catch {
      // Audio waiting for interaction
    }

    // Fast 750ms switching so all 5 images cycle quickly and distinctly
    const sceneInterval = setInterval(() => {
      setCurrentSceneIndex((prev) => (prev + 1) % scenes.length);
    }, 750);

    const startTime = Date.now();
    const duration = 4800; // 4.8 seconds allows all 5 development images to be fully showcased rapidly
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(progressInterval);
        clearInterval(sceneInterval);
        setTimeout(() => {
          handleFinish();
        }, 300);
      }
    }, 25);

    return () => {
      clearInterval(sceneInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const handleToggleAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    dhurandharAudio.toggleMusic();
  };

  const handleFinish = () => {
    setIsDismissing(true);
    soundEffects.playLockOn();
    // Ensure music keeps playing smoothly into the site
    dhurandharAudio.startMusic();
    window.dispatchEvent(new CustomEvent('higgsfield-pulse', { detail: { color: '#ff9933' } }));
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  // 🇮🇳 Dazzling Light Effects & Higgsfield Quantum Waves Canvas Animation
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
    };
    window.addEventListener('resize', handleResize);

    // Light Sparkles & Tricolor Embers
    const sparkles: { x: number; y: number; vx: number; vy: number; radius: number; color: string; alpha: number }[] = [];
    const colors = ['#FF9933', '#FFAA44', '#FFFFFF', '#138808', '#00f2fe'];
    const count = 75;

    for (let i = 0; i < count; i++) {
      sparkles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.2 - 0.4,
        radius: 1.5 + Math.random() * 2.5,
        color: colors[i % colors.length],
        alpha: 0.25 + Math.random() * 0.7
      });
    }

    let t = 0;

    const render = () => {
      t += 0.035;
      ctx.clearRect(0, 0, width, height);

      // 1. Dazzling Anamorphic Light Rays from center
      const cx = width / 2;
      const cy = height * 0.45;
      const beamCount = 8;
      ctx.save();
      for (let b = 0; b < beamCount; b++) {
        const angle = (b * Math.PI * 2) / beamCount + t * 0.2;
        const grad = ctx.createRadialGradient(cx, cy, 50, cx, cy, width * 0.7);
        const color = b % 3 === 0 ? 'rgba(255, 153, 51, 0.12)' : b % 3 === 1 ? 'rgba(255, 255, 255, 0.10)' : 'rgba(19, 136, 8, 0.12)';
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, width * 0.65, angle - 0.12, angle + 0.12);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.restore();

      // 2. Higgsfield Quantum Waves Across Screen
      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        const waveY = height * (0.35 + wave * 0.2);
        ctx.strokeStyle = wave === 0 ? 'rgba(255, 153, 51, 0.26)' : wave === 1 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(19, 136, 8, 0.26)';
        ctx.lineWidth = 3;

        for (let x = 0; x <= width; x += 12) {
          const y = waveY + Math.sin(x * 0.0035 + t + wave) * 32 + Math.cos(x * 0.007 + t * 1.5) * 16;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // 3. Floating Dazzling Sparkles & Embers
      sparkles.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;

        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // 4. Horizontal Optical Laser Scanner Beam
      const scanY = (height * 0.5) + Math.sin(t * 2.5) * (height * 0.38);
      const laserGrad = ctx.createLinearGradient(0, scanY, width, scanY);
      laserGrad.addColorStop(0, 'rgba(0, 242, 254, 0)');
      laserGrad.addColorStop(0.3, 'rgba(255, 153, 51, 0.8)');
      laserGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
      laserGrad.addColorStop(0.7, 'rgba(19, 136, 8, 0.8)');
      laserGrad.addColorStop(1, 'rgba(0, 242, 254, 0)');
      ctx.fillStyle = laserGrad;
      ctx.fillRect(0, scanY - 1.5, width, 3);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const activeScene = scenes[currentSceneIndex];

  return (
    <div
      onClick={() => {
        if (!isPlayingAudio) {
          dhurandharAudio.startMusic();
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#02050f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono)',
        color: '#f8fafc',
        opacity: isDismissing ? 0 : 1,
        transition: 'opacity 0.5s ease',
        cursor: 'pointer'
      }}
    >
      {/* 1. Cinematic Background Video Transition Showcase */}
      {scenes.map((scene, idx) => {
        const isCurrent = idx === currentSceneIndex;
        return (
          <div
            key={scene.id}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: isCurrent ? 1 : 0,
              transform: isCurrent ? 'scale(1.04)' : 'scale(1.0)',
              transition: 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s ease-out',
              zIndex: isCurrent ? 2 : 1,
              pointerEvents: 'none'
            }}
          >
            <img
              src={scene.image}
              alt={scene.title}
              loading="eager"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                filter: 'brightness(0.88) contrast(1.18)'
              }}
            />
            {/* Cinematic Gradient Vignette & Letterbox */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(3, 7, 18, 0.12) 0%, rgba(2, 5, 14, 0.86) 80%)'
            }} />
          </div>
        );
      })}

      {/* 2. Rapid High-Energy Scene Flash on Image Switch */}
      <div
        key={`flash-${currentSceneIndex}`}
        className="quick-scene-flash"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.32) 0%, rgba(255, 153, 51, 0.2) 45%, transparent 75%)',
          pointerEvents: 'none',
          zIndex: 4
        }}
      />

      {/* 2. Dazzling Light Effects & Higgsfield Canvas Overlay */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 3
        }}
      />

      {/* 3. Top Header Bar with Viksit Bharat Branding & Pause Only Button */}
      <div style={{
        position: 'absolute',
        top: 24,
        left: 24,
        right: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#ff9933',
            boxShadow: '0 0 10px #ff9933'
          }} />
          <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.12em', color: '#ff9933' }}>
            🇮🇳 VIKSIT BHARAT // INDIA’S DEVELOPMENT SHOWCASE
          </span>
        </div>

        {/* Top Right Controls: Pause Only & Skip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Pause / Play Only Button */}
          <button
            onClick={handleToggleAudio}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 16px',
              borderRadius: 99,
              background: isPlayingAudio
                ? 'linear-gradient(135deg, #138808, #10b981)'
                : 'linear-gradient(135deg, #ff9933, #e67300)',
              border: 'none',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              boxShadow: isPlayingAudio
                ? '0 0 15px rgba(16, 185, 129, 0.45)'
                : '0 0 15px rgba(255, 153, 51, 0.45)'
            }}
            title={isPlayingAudio ? 'Pause Audio' : 'Play Audio'}
          >
            {isPlayingAudio ? <Pause size={13} fill="#ffffff" /> : <Play size={13} fill="#ffffff" />}
            <span>{isPlayingAudio ? 'PAUSE' : 'PLAY'}</span>
          </button>

          {/* Skip Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFinish();
            }}
            style={{
              padding: '7px 16px',
              borderRadius: 99,
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(0, 242, 254, 0.4)',
              color: '#00f2fe',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)'
            }}
          >
            SKIP [ESC]
          </button>
        </div>
      </div>

      {/* 4. Centerpiece Showcase Card: India's Developments & Dazzling Lighting */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '740px',
        width: '92%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '1.75rem 2rem',
        background: 'rgba(4, 9, 20, 0.86)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1.5px solid rgba(255, 153, 51, 0.55)',
        boxShadow: '0 16px 50px rgba(0, 0, 0, 0.85), 0 0 40px rgba(255, 153, 51, 0.25)'
      }}>
        {/* Dynamic Card Content with Rapid Snap */}
        <div
          key={activeScene.id}
          className="scene-text-snap"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
        >
          {/* Dynamic Scene Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 16px',
            borderRadius: 99,
            background: 'rgba(255, 153, 51, 0.2)',
            border: '1px solid rgba(255, 153, 51, 0.5)',
            marginBottom: 10
          }}>
            <span style={{ fontSize: '16px' }}>{activeScene.icon}</span>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#ffaa44', letterSpacing: '0.1em' }}>
              {activeScene.badge}
            </span>
          </div>

          {/* Dynamic Title */}
          <h1 style={{
            fontSize: '2.1rem',
            fontWeight: 900,
            letterSpacing: '0.04em',
            margin: '0 0 6px 0',
            background: 'linear-gradient(90deg, #ff9933 0%, #ffffff 50%, #138808 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 25px rgba(255, 153, 51, 0.6))'
          }}>
            {activeScene.title}
          </h1>

          <p style={{
            fontSize: '0.86rem',
            color: '#e2e8f0',
            margin: '0 0 18px 0',
            lineHeight: 1.5,
            maxWidth: '620px'
          }}>
            {activeScene.subtitle}
          </p>
        </div>

        {/* Interactive Scene Switcher Navigation Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 18
        }}>
          {scenes.map((sc, sIdx) => {
            const isSel = sIdx === currentSceneIndex;
            return (
              <button
                key={sc.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSceneIndex(sIdx);
                  soundEffects.playClick();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 13px',
                  borderRadius: 99,
                  background: isSel ? 'rgba(255, 153, 51, 0.35)' : 'rgba(255, 255, 255, 0.06)',
                  border: isSel ? '1.5px solid #ff9933' : '1px solid rgba(255, 255, 255, 0.15)',
                  color: isSel ? '#ffffff' : '#94a3b8',
                  fontSize: '11px',
                  fontWeight: isSel ? 800 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSel ? '0 0 14px rgba(255, 153, 51, 0.5)' : 'none',
                  transform: isSel ? 'scale(1.05)' : 'scale(1.0)'
                }}
              >
                <span>{sc.icon}</span>
                <span>{sc.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Tricolor Progress Bar */}
        <div style={{
          width: '100%',
          height: 8,
          borderRadius: 99,
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          overflow: 'hidden',
          padding: 1,
          marginBottom: 10
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            borderRadius: 99,
            background: 'linear-gradient(90deg, #ff9933 0%, #ffffff 50%, #138808 100%)',
            transition: 'width 0.08s ease'
          }} />
        </div>

        {/* Telemetry Status Line */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          color: '#38bdf8',
          marginBottom: 16
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00f2fe' }} />
            DEVELOPMENT SHOWCASE [{currentSceneIndex + 1}/{scenes.length}]
          </span>
          <strong style={{ fontSize: '13px', color: '#ff9933' }}>{progress}%</strong>
        </div>

        {/* Enter System Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFinish();
          }}
          style={{
            padding: '11px 36px',
            borderRadius: 99,
            background: 'linear-gradient(90deg, #ff9933 0%, #138808 100%)',
            border: 'none',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(255, 153, 51, 0.55)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <span>ENTER SYSTEM DIRECTLY</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Footer Info */}
      <div style={{
        position: 'absolute',
        bottom: 18,
        fontSize: '11px',
        color: '#64748b',
        textAlign: 'center',
        zIndex: 10
      }}>
        HIGGSFIELD QUANTUM MOTION • VIKSIT BHARAT 2047 • 100% LOCALHOST
      </div>
    </div>
  );
};
