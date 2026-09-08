import React, { useEffect } from 'react';
import type { RiskScoreBreakdown } from '../types';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Download,
  CheckCircle2,
  ArrowLeft,
  RotateCcw,
  Award
} from 'lucide-react';

interface RiskEngineStepProps {
  riskBreakdown: RiskScoreBreakdown;
  onOpenCertificate: () => void;
  onExportJson: () => void;
  onReset: () => void;
  onPrev: () => void;
}

export const RiskEngineStep: React.FC<RiskEngineStepProps> = ({
  riskBreakdown,
  onOpenCertificate,
  onExportJson,
  onReset,
  onPrev
}) => {
  const isVerified = riskBreakdown.classification === 'VERIFIED';
  const isReview = riskBreakdown.classification === 'REVIEW_REQUIRED';

  // Fire confetti if verified!
  useEffect(() => {
    if (isVerified) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  }, [isVerified]);

  const getVerdictTheme = () => {
    if (isVerified) {
      return {
        badgeClass: 'badge-green',
        title: 'IDENTITY & DOCUMENT VERIFIED',
        color: 'var(--color-verified)',
        borderColor: 'rgba(16, 185, 129, 0.4)',
        bgGlow: 'rgba(16, 185, 129, 0.1)',
        shadow: 'var(--shadow-neon-green)',
        icon: ShieldCheck
      };
    } else if (isReview) {
      return {
        badgeClass: 'badge-amber',
        title: 'MANUAL REVIEW REQUIRED',
        color: 'var(--color-review)',
        borderColor: 'rgba(245, 158, 11, 0.4)',
        bgGlow: 'rgba(245, 158, 11, 0.1)',
        shadow: '0 0 20px rgba(245, 158, 11, 0.25)',
        icon: AlertTriangle
      };
    } else {
      return {
        badgeClass: 'badge-red',
        title: 'HIGH RISK / REJECTION FLAGGED',
        color: 'var(--color-danger)',
        borderColor: 'rgba(239, 68, 68, 0.5)',
        bgGlow: 'rgba(239, 68, 68, 0.12)',
        shadow: 'var(--shadow-neon-red)',
        icon: ShieldAlert
      };
    }
  };

  const theme = getVerdictTheme();
  const VerdictIcon = theme.icon;

  // Circular gauge calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskBreakdown.totalScore / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Master Verdict Card */}
      <div className="glass-panel" style={{
        padding: '2rem',
        border: `1.5px solid ${theme.borderColor}`,
        background: `linear-gradient(135deg, ${theme.bgGlow} 0%, rgba(15, 23, 42, 0.9) 100%)`,
        boxShadow: theme.shadow,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          {/* Left Text & Verdict */}
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <span className={`badge ${theme.badgeClass}`}>
                Explainable Risk Engine Verdict
              </span>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                Audit ID: {riskBreakdown.auditId}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: theme.bgGlow,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${theme.borderColor}`
              }}>
                <VerdictIcon size={26} color={theme.color} />
              </div>
              <h1 style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: theme.color,
                lineHeight: 1.2
              }}>
                {theme.title}
              </h1>
            </div>

            <p style={{ fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {riskBreakdown.recommendation}
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={onOpenCertificate}
                className="btn btn-primary"
                style={{
                  background: isVerified
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'linear-gradient(135deg, #00f2fe, #38bdf8)',
                  color: isVerified ? '#ffffff' : '#050b14'
                }}
              >
                <Award size={16} />
                <span>View Tamper-Evident Certificate</span>
              </button>

              <button onClick={onExportJson} className="btn btn-secondary">
                <Download size={15} />
                <span>Export Audit JSON</span>
              </button>

              <button onClick={onReset} className="btn btn-secondary">
                <RotateCcw size={15} />
                <span>Verify Another ID</span>
              </button>

              <button onClick={onPrev} className="btn btn-secondary">
                <ArrowLeft size={15} />
                <span>Back to Biometrics</span>
              </button>
            </div>
          </div>

          {/* Right: Circular Score Gauge */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '180px'
          }}>
            <div style={{ position: 'relative', width: '150px', height: '150px' }}>
              <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background circle */}
                <circle
                  cx="75"
                  cy="75"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Progress circle */}
                <circle
                  cx="75"
                  cy="75"
                  r={radius}
                  stroke={theme.color}
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
              </svg>
              {/* Center text */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-sans)', lineHeight: 1 }}>
                  {riskBreakdown.totalScore}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                  Total Score / 100
                </span>
              </div>
            </div>

            <div style={{
              marginTop: '0.65rem',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)'
            }}>
              Zero-Trust Multi-Layered
            </div>
          </div>
        </div>
      </div>

      {/* Layer-by-Layer Weighted Contribution Grid */}
      <div className="grid-4">
        {/* Layer 1 */}
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>OCR &amp; Consistency</span>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>Weight 20%</span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.3rem' }}>
            {riskBreakdown.layerScores.ocrAndConsistency}/100
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${riskBreakdown.layerScores.ocrAndConsistency}%`,
              background: riskBreakdown.layerScores.ocrAndConsistency >= 80 ? 'var(--color-verified)' : 'var(--color-danger)'
            }} />
          </div>
        </div>

        {/* Layer 2 */}
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Forensic Integrity</span>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>Weight 30%</span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.3rem' }}>
            {riskBreakdown.layerScores.documentForensics}/100
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${riskBreakdown.layerScores.documentForensics}%`,
              background: riskBreakdown.layerScores.documentForensics >= 80 ? 'var(--color-verified)' : 'var(--color-danger)'
            }} />
          </div>
        </div>

        {/* Layer 3 */}
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Authority Registry</span>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>Weight 25%</span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.3rem' }}>
            {riskBreakdown.layerScores.authorityDatabase}/100
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${riskBreakdown.layerScores.authorityDatabase}%`,
              background: riskBreakdown.layerScores.authorityDatabase >= 80 ? 'var(--color-verified)' : 'var(--color-danger)'
            }} />
          </div>
        </div>

        {/* Layer 4 */}
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Webcam Biometrics</span>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>Weight 25%</span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.3rem' }}>
            {riskBreakdown.layerScores.biometricsLiveness}/100
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${riskBreakdown.layerScores.biometricsLiveness}%`,
              background: riskBreakdown.layerScores.biometricsLiveness >= 70 ? 'var(--color-verified)' : 'var(--color-danger)'
            }} />
          </div>
        </div>
      </div>

      {/* Explainable Findings: Positive Signals vs Risk Factors */}
      <div className="grid-2">
        {/* Positive Signals */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CheckCircle2 size={18} color="var(--color-verified)" />
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
              Validated Positive Signals ({riskBreakdown.positiveSignals.length})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {riskBreakdown.positiveSignals.map((signal, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 0.85rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                    {signal.title}
                  </span>
                  <span className="badge badge-cyan" style={{ fontSize: '0.62rem' }}>
                    {signal.layer}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {signal.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Flagged Risk Factors */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertTriangle size={18} color="var(--color-danger)" />
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
              Flagged Risk Factors &amp; Anomalies ({riskBreakdown.riskFactors.length})
            </span>
          </div>

          {riskBreakdown.riskFactors.length === 0 ? (
            <div style={{
              background: 'rgba(16, 185, 129, 0.04)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: '0.82rem'
            }}>
              Zero risk factors identified. Document and presenter satisfy all zero-trust checks.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {riskBreakdown.riskFactors.map((rf, i) => (
                <div
                  key={i}
                  style={{
                    background: rf.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.09)' : 'rgba(245, 158, 11, 0.08)',
                    border: rf.severity === 'CRITICAL' ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.65rem 0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: rf.severity === 'CRITICAL' ? '#fca5a5' : '#fde68a'
                    }}>
                      {rf.title}
                    </span>
                    <span className={`badge ${rf.severity === 'CRITICAL' ? 'badge-red' : 'badge-amber'}`} style={{ fontSize: '0.62rem' }}>
                      {rf.severity}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {rf.detail}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
