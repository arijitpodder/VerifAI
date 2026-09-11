import React, { useEffect, useState, useRef } from 'react';
import { dhurandharAudio } from '../services/dhurandharAudioService';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export const DhurandharMusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(dhurandharAudio.isMusicPlaying());
  const [volume, setVolume] = useState(dhurandharAudio.currentVolume);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const unsubscribe = dhurandharAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Real-time Audio Spectrum Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const analyser = dhurandharAudio.getAnalyser();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (analyser && isPlaying) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);

        const barCount = 12;
        const barWidth = canvas.width / barCount - 2;

        for (let i = 0; i < barCount; i++) {
          const val = dataArray[i * 2] || 0;
          const barHeight = Math.max(3, (val / 255) * canvas.height);
          const x = i * (barWidth + 2);
          const y = canvas.height - barHeight;

          // Tricolor Equalizer: Saffron, White, Green
          let barColor = '#ff9933';
          if (i >= 4 && i < 8) barColor = '#ffffff';
          else if (i >= 8) barColor = '#138808';

          ctx.fillStyle = barColor;
          ctx.fillRect(x, y, barWidth, barHeight);
        }
      } else {
        // Flat idle baseline
        for (let i = 0; i < 12; i++) {
          ctx.fillStyle = 'rgba(255, 153, 51, 0.25)';
          ctx.fillRect(i * 5, canvas.height - 3, 3, 3);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const handleToggle = () => {
    dhurandharAudio.toggleMusic();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    dhurandharAudio.setVolume(val);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 18,
      right: 18,
      zIndex: 40,
      fontFamily: 'var(--font-mono)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 16px',
        borderRadius: 99,
        background: 'rgba(6, 12, 24, 0.94)',
        backdropFilter: 'blur(16px)',
        border: '1.5px solid rgba(255, 153, 51, 0.6)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.75), 0 0 20px rgba(255, 153, 51, 0.3)'
      }}>
        {/* Spectrum Visualizer */}
        <canvas
          ref={canvasRef}
          width={58}
          height={18}
          style={{ borderRadius: 3, background: 'rgba(0,0,0,0.45)' }}
        />

        {/* Only Pause / Play Button */}
        <button
          onClick={handleToggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 14px',
            borderRadius: 99,
            background: isPlaying
              ? 'linear-gradient(135deg, #138808, #10b981)'
              : 'linear-gradient(135deg, #ff9933, #e67300)',
            border: 'none',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer',
            letterSpacing: '0.05em',
            boxShadow: isPlaying ? '0 0 12px rgba(16, 185, 129, 0.5)' : '0 0 12px rgba(255, 153, 51, 0.5)'
          }}
          title={isPlaying ? 'Pause Audio' : 'Play Audio'}
        >
          {isPlaying ? <Pause size={13} fill="#ffffff" /> : <Play size={13} fill="#ffffff" />}
          <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
        </button>

        {/* Volume Level Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {volume === 0 ? <VolumeX size={14} color="#64748b" /> : <Volume2 size={14} color="#ff9933" />}
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={handleVolumeChange}
            style={{ width: '50px', accentColor: '#ff9933', cursor: 'pointer' }}
            title="Volume"
          />
        </div>
      </div>
    </div>
  );
};
