import React, { useRef, useEffect, useState } from 'react';
import type { FaceLandmarkVisualization } from '../services/biometricsEngine';

interface FaceLandmarkOverlayProps {
  imageSrc: string;
  visualization?: FaceLandmarkVisualization;
  width: number;
  height: number;
  showAllDots?: boolean;      // Show all 478 mesh dots
  showKeypoints?: boolean;    // Show colored key landmarks
  showMeasurements?: boolean; // Show measurement lines with labels
  showMeshLines?: boolean;    // Show connecting mesh triangles
  label?: string;
  borderColor?: string;
}

// MediaPipe Face Mesh tessellation connections (key subset for visual effect)
const MESH_CONNECTIONS: [number, number][] = [
  // Jaw contour
  [10, 338], [338, 297], [297, 332], [332, 284], [284, 251], [251, 389],
  [389, 356], [356, 454], [454, 323], [323, 361], [361, 288], [288, 397],
  [397, 365], [365, 379], [379, 378], [378, 400], [400, 377], [377, 152],
  [152, 148], [148, 176], [176, 149], [149, 150], [150, 136], [136, 172],
  [172, 58], [58, 132], [132, 93], [93, 234], [234, 127], [127, 162],
  [162, 21], [21, 54], [54, 103], [103, 67], [67, 109], [109, 10],
  // Left eye
  [33, 7], [7, 163], [163, 144], [144, 145], [145, 153], [153, 154],
  [154, 155], [155, 133], [133, 173], [173, 157], [157, 158], [158, 159],
  [159, 160], [160, 161], [161, 246], [246, 33],
  // Right eye
  [263, 249], [249, 390], [390, 373], [373, 374], [374, 380], [380, 381],
  [381, 382], [382, 362], [362, 398], [398, 384], [384, 385], [385, 386],
  [386, 387], [387, 388], [388, 466], [466, 263],
  // Left eyebrow
  [46, 53], [53, 52], [52, 65], [65, 55], [55, 107],
  [66, 105], [105, 63], [63, 70],
  // Right eyebrow
  [276, 283], [283, 282], [282, 295], [295, 285], [285, 336],
  [296, 334], [334, 293], [293, 300],
  // Nose bridge
  [168, 6], [6, 197], [197, 195], [195, 5], [5, 4], [4, 1],
  // Nose wings
  [129, 49], [49, 131], [131, 134], [134, 51], [51, 5],
  [358, 279], [279, 360], [360, 363], [363, 281], [281, 5],
  // Nose bottom
  [129, 102], [102, 48], [48, 115], [115, 220], [220, 45], [45, 4],
  [358, 331], [331, 278], [278, 344], [344, 440], [440, 275], [275, 4],
  // Mouth outer
  [61, 146], [146, 91], [91, 181], [181, 84], [84, 17], [17, 314],
  [314, 405], [405, 321], [321, 375], [375, 291],
  [61, 185], [185, 40], [40, 39], [39, 37], [37, 0], [0, 267],
  [267, 269], [269, 270], [270, 409], [409, 291],
  // Mouth inner
  [78, 95], [95, 88], [88, 178], [178, 87], [87, 14], [14, 317],
  [317, 402], [402, 318], [318, 324], [324, 308],
  [78, 191], [191, 80], [80, 81], [81, 82], [82, 13], [13, 312],
  [312, 311], [311, 310], [310, 415], [415, 308],
  // Eye-nose bridge
  [168, 193], [193, 245], [245, 128], [128, 114],
  [168, 417], [417, 465], [465, 357], [357, 343],
];

export const FaceLandmarkOverlay: React.FC<FaceLandmarkOverlayProps> = ({
  imageSrc,
  visualization,
  width,
  height,
  showAllDots = true,
  showKeypoints = true,
  showMeasurements = true,
  showMeshLines = true,
  label,
  borderColor = 'var(--cyan-primary)'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationFrame, setAnimationFrame] = useState(0);
  const animationRef = useRef<number | null>(null);

  // Subtle pulsing animation for dots (throttled to ~30fps for performance)
  useEffect(() => {
    let frame = 0;
    let lastTime = 0;
    const targetInterval = 1000 / 30; // 30fps cap
    const animate = (time: number) => {
      if (time - lastTime >= targetInterval) {
        frame++;
        setAnimationFrame(frame);
        lastTime = time;
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Main rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visualization) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const { landmarks, keypoints, measurementLines } = visualization;
    const pulsePhase = (animationFrame % 120) / 120; // 0 to 1 cycle
    const pulse = 0.6 + 0.4 * Math.sin(pulsePhase * Math.PI * 2);

    // ── Draw jaw contour outline (smooth bezier curve) ──
    if (visualization.jawContour && visualization.jawContour.length > 2) {
      const jc = visualization.jawContour;
      ctx.strokeStyle = `rgba(99, 102, 241, ${0.5 * pulse})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(jc[0].x * w, jc[0].y * h);
      // Smooth curve through contour points using quadratic bezier
      for (let i = 1; i < jc.length - 1; i++) {
        const cpx = (jc[i].x * w + jc[i + 1].x * w) / 2;
        const cpy = (jc[i].y * h + jc[i + 1].y * h) / 2;
        ctx.quadraticCurveTo(jc[i].x * w, jc[i].y * h, cpx, cpy);
      }
      ctx.stroke();
    }

    // ── Draw mesh connection lines (subtle green web) ──
    if (showMeshLines && landmarks.length > 0) {
      ctx.strokeStyle = `rgba(0, 242, 254, ${0.12 * pulse})`;
      ctx.lineWidth = 0.5;
      for (const [i, j] of MESH_CONNECTIONS) {
        if (i < landmarks.length && j < landmarks.length) {
          ctx.beginPath();
          ctx.moveTo(landmarks[i].x * w, landmarks[i].y * h);
          ctx.lineTo(landmarks[j].x * w, landmarks[j].y * h);
          ctx.stroke();
        }
      }
    }

    // ── Draw all 478 landmark dots ──
    if (showAllDots && landmarks.length > 0) {
      for (let i = 0; i < landmarks.length; i++) {
        const pt = landmarks[i];
        const x = pt.x * w;
        const y = pt.y * h;

        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${0.35 * pulse})`;
        ctx.fill();
      }
    }

    // ── Draw measurement lines with labels ──
    if (showMeasurements && measurementLines.length > 0) {
      for (const line of measurementLines) {
        const x1 = line.from.x * w;
        const y1 = line.from.y * h;
        const x2 = line.to.x * w;
        const y2 = line.to.y * h;

        // Dashed line — color depends on match quality
        const lineColor = line.matchQuality === 'MATCH' ? 'rgba(16, 185, 129,' 
          : line.matchQuality === 'MISMATCH' ? 'rgba(239, 68, 68,' 
          : 'rgba(251, 191, 36,';
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = `${lineColor} ${0.7 * pulse})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Small endpoint circles — colored by match quality
        const dotColor = line.matchQuality === 'MATCH' ? '#10b981' 
          : line.matchQuality === 'MISMATCH' ? '#ef4444' 
          : '#fbbf24';
        ctx.beginPath();
        ctx.arc(x1, y1, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x2, y2, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Label text (positioned at midpoint, offset slightly)
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        // Determine text offset direction to avoid overlapping the line
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        // Perpendicular offset
        const offsetX = len > 0 ? (-dy / len) * 10 : 5;
        const offsetY = len > 0 ? (dx / len) * 10 : -5;

        const textX = midX + offsetX;
        const textY = midY + offsetY;

        // Background pill for text — includes match indicator
        const matchIcon = line.matchQuality === 'MATCH' ? ' ✓' 
          : line.matchQuality === 'MISMATCH' ? ' ✗' 
          : '';
        const text = `${line.label}: ${line.value}${matchIcon}`;
        ctx.font = 'bold 7px Inter, sans-serif';
        const textWidth = ctx.measureText(text).width;
        
        ctx.fillStyle = 'rgba(5, 11, 20, 0.85)';
        ctx.beginPath();
        const pillW = textWidth + 6;
        const pillH = 11;
        const pillX = textX - pillW / 2;
        const pillY = textY - pillH / 2;
        ctx.roundRect(pillX, pillY, pillW, pillH, 3);
        ctx.fill();

        ctx.fillStyle = dotColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, textX, textY);
      }
    }

    // ── Draw key landmarks (larger, color-coded dots with labels) ──
    if (showKeypoints && keypoints.length > 0) {
      for (const kp of keypoints) {
        const x = kp.x * w;
        const y = kp.y * h;
        const r = (kp.radius || 4) * pulse;

        // Glow effect
        ctx.shadowColor = kp.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(x, y, r + 2, 0, Math.PI * 2);
        ctx.fillStyle = `${kp.color}33`;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Solid dot
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = kp.color;
        ctx.fill();

        // White border
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Label
        ctx.font = 'bold 6.5px Inter, sans-serif';
        ctx.fillStyle = 'rgba(5, 11, 20, 0.8)';
        const labelW = ctx.measureText(kp.label).width + 5;
        ctx.fillRect(x + r + 3, y - 5, labelW, 10);
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(kp.label, x + r + 5, y);
      }
    }

  }, [visualization, animationFrame, showAllDots, showKeypoints, showMeasurements, showMeshLines]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: 'var(--radius-md, 8px)',
        overflow: 'hidden',
        border: `2px solid ${borderColor}`,
        background: '#040813',
        margin: '0 auto'
      }}
    >
      {/* Face image */}
      <img
        src={imageSrc}
        alt={label || 'Face'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
      />

      {/* Canvas overlay for dots and lines */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />

      {/* "AI Scanning" badge */}
      {visualization && (
        <div style={{
          position: 'absolute',
          top: '6px',
          left: '6px',
          background: 'rgba(5, 11, 20, 0.85)',
          border: '1px solid rgba(0, 242, 254, 0.5)',
          borderRadius: '4px',
          padding: '2px 7px',
          fontSize: '0.6rem',
          fontWeight: 800,
          color: '#00f2fe',
          letterSpacing: '0.05em',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '3px'
        }}>
          <span style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 6px #10b981',
            display: 'inline-block'
          }} />
          478 AI DOTS
        </div>
      )}

      {/* Measurement count badge */}
      {visualization && (
        <div style={{
          position: 'absolute',
          bottom: '6px',
          right: '6px',
          background: 'rgba(5, 11, 20, 0.85)',
          border: '1px solid rgba(251, 191, 36, 0.5)',
          borderRadius: '4px',
          padding: '2px 7px',
          fontSize: '0.58rem',
          fontWeight: 700,
          color: '#fbbf24',
          letterSpacing: '0.04em',
          pointerEvents: 'none'
        }}>
          {visualization.measurementLines.length} MEASUREMENTS
        </div>
      )}

      {/* Label at bottom */}
      {label && (
        <div style={{
          position: 'absolute',
          bottom: '6px',
          left: '6px',
          background: 'rgba(5, 11, 20, 0.85)',
          borderRadius: '4px',
          padding: '2px 7px',
          fontSize: '0.6rem',
          fontWeight: 700,
          color: '#e2e8f0',
          pointerEvents: 'none'
        }}>
          {label}
        </div>
      )}
    </div>
  );
};
