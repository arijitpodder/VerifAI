import React, { useState } from 'react';
import type { ForensicsResult } from '../types';
import {
  Flame,
  Activity,
  AlertOctagon,
  ArrowRight,
  ArrowLeft,
  Eye,
  Info
} from 'lucide-react';

interface ForensicViewerStepProps {
  forensics: ForensicsResult;
  originalImageUri: string;
  onNext: () => void;
  onPrev: () => void;
}

type ViewMode = 'ORIGINAL' | 'ELA_HEATMAP' | 'EDGE_SPLICING' | 'OVERLAY';

export const ForensicViewerStep: React.FC<ForensicViewerStepProps> = ({
  forensics,
  originalImageUri,
  onNext,
  onPrev
}) => {
  const [activeMode, setActiveMode] = useState<ViewMode>('ELA_HEATMAP');
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  const getDisplayedImage = () => {
    switch (activeMode) {
      case 'ELA_HEATMAP':
        return forensics.elaImageDataUrl || originalImageUri;
      case 'EDGE_SPLICING':
        return forensics.edgeImageDataUrl || originalImageUri;
      case 'ORIGINAL':
      case 'OVERLAY':
      default:
        return originalImageUri;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-cyan">Layer 3 of 6</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              AI Document Forensics &amp; Tampering Analysis
            </h2>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Error Level Analysis (ELA), edge boundary splicing detection, and local noise pattern consistency.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className={`badge ${
            forensics.overallScore >= 80 ? 'badge-green' : forensics.overallScore >= 50 ? 'badge-amber' : 'badge-red'
          }`}>
            Forensic Integrity: {forensics.overallScore}/100
          </span>
        </div>
      </div>

      <div className="grid-2">
        {/* Left: Forensic Image Viewer with Mode Switcher */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.4rem',
            background: '#040813',
            padding: '0.35rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            border: '1px solid var(--border-subtle)',
            overflowX: 'auto'
          }}>
            <button
              onClick={() => setActiveMode('ELA_HEATMAP')}
              style={{
                flex: 1,
                padding: '0.45rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                background: activeMode === 'ELA_HEATMAP' ? 'linear-gradient(135deg, #00f2fe, #38bdf8)' : 'transparent',
                color: activeMode === 'ELA_HEATMAP' ? '#050b14' : 'var(--text-secondary)'
              }}
            >
              <Flame size={14} />
              <span>ELA Heatmap</span>
            </button>

            <button
              onClick={() => setActiveMode('EDGE_SPLICING')}
              style={{
                flex: 1,
                padding: '0.45rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                background: activeMode === 'EDGE_SPLICING' ? 'linear-gradient(135deg, #00f2fe, #38bdf8)' : 'transparent',
                color: activeMode === 'EDGE_SPLICING' ? '#050b14' : 'var(--text-secondary)'
              }}
            >
              <Activity size={14} />
              <span>Edge Splicing</span>
            </button>

            <button
              onClick={() => setActiveMode('OVERLAY')}
              style={{
                flex: 1,
                padding: '0.45rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                background: activeMode === 'OVERLAY' ? 'linear-gradient(135deg, #00f2fe, #38bdf8)' : 'transparent',
                color: activeMode === 'OVERLAY' ? '#050b14' : 'var(--text-secondary)'
              }}
            >
              <AlertOctagon size={14} />
              <span>Flagged Zones</span>
            </button>

            <button
              onClick={() => setActiveMode('ORIGINAL')}
              style={{
                flex: 1,
                padding: '0.45rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                background: activeMode === 'ORIGINAL' ? 'linear-gradient(135deg, #00f2fe, #38bdf8)' : 'transparent',
                color: activeMode === 'ORIGINAL' ? '#050b14' : 'var(--text-secondary)'
              }}
            >
              <Eye size={14} />
              <span>Original</span>
            </button>
          </div>

          {/* Canvas Viewport */}
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: '#040813',
            border: forensics.tamperingDetected
              ? '1.5px solid rgba(239, 68, 68, 0.5)'
              : '1.5px solid rgba(0, 242, 254, 0.3)',
            boxShadow: forensics.tamperingDetected
              ? 'var(--shadow-neon-red)'
              : 'var(--shadow-neon-cyan)'
          }}>
            <img
              src={getDisplayedImage()}
              alt="Forensic Rendering"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />

            {/* Tampered Region Bounding Box Overlays */}
            {(activeMode === 'OVERLAY' || activeMode === 'ELA_HEATMAP') &&
              forensics.flaggedRegions.map((region) => {
                const isHovered = hoveredRegionId === region.id;
                // Coordinates relative to 650x420 standard
                const leftPercent = (region.x / 650) * 100;
                const topPercent = (region.y / 420) * 100;
                const widthPercent = (region.width / 650) * 100;
                const heightPercent = (region.height / 420) * 100;

                return (
                  <div
                    key={region.id}
                    onMouseEnter={() => setHoveredRegionId(region.id)}
                    onMouseLeave={() => setHoveredRegionId(null)}
                    style={{
                      position: 'absolute',
                      left: `${leftPercent}%`,
                      top: `${topPercent}%`,
                      width: `${widthPercent}%`,
                      height: `${heightPercent}%`,
                      border: '2px solid #f43f5e',
                      background: isHovered ? 'rgba(244, 63, 94, 0.35)' : 'rgba(244, 63, 94, 0.15)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: '0 0 12px rgba(244, 63, 94, 0.6)'
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      top: '-18px',
                      left: '0',
                      background: '#f43f5e',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '3px',
                      whiteSpace: 'nowrap',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {region.label}
                    </span>
                  </div>
                );
              })}
          </div>

          {/* Mode Explanation Caption */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.75rem',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)'
          }}>
            <Info size={14} color="var(--cyan-primary)" />
            <span>
              {activeMode === 'ELA_HEATMAP' && 'Error Level Analysis: Magenta/Red highlights indicate resaved digital blocks with higher compression error delta.'}
              {activeMode === 'EDGE_SPLICING' && 'Sobel Filter: Identifies sharp boundary gradient discontinuities typical of spliced fonts and pasted cutouts.'}
              {activeMode === 'OVERLAY' && 'Flagged Regions: Bounding boxes around localized anomalies flagged by neural inspection.'}
              {activeMode === 'ORIGINAL' && 'Original optical capture of the credential.'}
            </span>
          </div>
        </div>

        {/* Right: Granular Forensic Scores & Findings */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
            Forensic Metric Diagnostics
          </div>

          {/* Metrics Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Metric 1 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Error Level Analysis (ELA) Disparity</span>
                <span style={{
                  fontWeight: 700,
                  color: forensics.elaAnomalyScore > 50 ? 'var(--color-danger)' : 'var(--color-verified)'
                }}>
                  {forensics.elaAnomalyScore}% {forensics.elaAnomalyScore > 50 ? '(Abnormal Disparity)' : '(Uniform Gradient)'}
                </span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${forensics.elaAnomalyScore}%`,
                  background: forensics.elaAnomalyScore > 50 ? 'var(--color-danger)' : 'var(--color-verified)',
                  borderRadius: '3px'
                }} />
              </div>
            </div>

            {/* Metric 2 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Edge &amp; Splicing Discontinuity</span>
                <span style={{
                  fontWeight: 700,
                  color: forensics.edgeDiscontinuityScore > 50 ? 'var(--color-danger)' : 'var(--color-verified)'
                }}>
                  {forensics.edgeDiscontinuityScore}% {forensics.edgeDiscontinuityScore > 50 ? '(Spliced Seams)' : '(Seamless Transitions)'}
                </span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${forensics.edgeDiscontinuityScore}%`,
                  background: forensics.edgeDiscontinuityScore > 50 ? 'var(--color-danger)' : 'var(--color-verified)',
                  borderRadius: '3px'
                }} />
              </div>
            </div>

            {/* Metric 3 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Noise Pattern Uniformity</span>
                <span style={{
                  fontWeight: 700,
                  color: forensics.noiseInconsistencyScore > 50 ? 'var(--color-danger)' : 'var(--color-verified)'
                }}>
                  {100 - forensics.noiseInconsistencyScore}% {forensics.noiseInconsistencyScore > 50 ? '(Inconsistent Noise)' : '(Uniform Substrate)'}
                </span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${100 - forensics.noiseInconsistencyScore}%`,
                  background: forensics.noiseInconsistencyScore > 50 ? 'var(--color-danger)' : 'var(--color-verified)',
                  borderRadius: '3px'
                }} />
              </div>
            </div>

            {/* Metric 4 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Typography &amp; Font Uniformity</span>
                <span style={{
                  fontWeight: 700,
                  color: forensics.fontUniformityScore < 60 ? 'var(--color-danger)' : 'var(--color-verified)'
                }}>
                  {forensics.fontUniformityScore}% {forensics.fontUniformityScore < 60 ? '(Font Divergence Flagged)' : '(Compliant Typography)'}
                </span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${forensics.fontUniformityScore}%`,
                  background: forensics.fontUniformityScore < 60 ? 'var(--color-danger)' : 'var(--color-verified)',
                  borderRadius: '3px'
                }} />
              </div>
            </div>
          </div>

          {/* Forensic Summary Panel */}
          <div style={{
            background: forensics.tamperingDetected
              ? 'rgba(239, 68, 68, 0.1)'
              : 'rgba(16, 185, 129, 0.08)',
            border: forensics.tamperingDetected
              ? '1px solid rgba(239, 68, 68, 0.35)'
              : '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            marginTop: '1.25rem'
          }}>
            <div style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: forensics.tamperingDetected ? '#fca5a5' : '#86efac',
              marginBottom: '0.25rem'
            }}>
              {forensics.tamperingDetected ? 'TAMPERING DETECTED' : 'SUBSTRATE INTEGRITY VERIFIED'}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {forensics.summary}
            </p>
          </div>

          {/* Navigation Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.06)'
          }}>
            <button onClick={onPrev} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
              <ArrowLeft size={15} />
              <span>Back: OCR</span>
            </button>

            <button onClick={onNext} className="btn btn-primary" style={{ fontSize: '0.82rem' }}>
              <span>Step 4: Authority Database</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
