import React from 'react';
import type { ExtractedFields, RiskScoreBreakdown } from '../types';
import {
  X,
  Printer,
  Download,
  Award
} from 'lucide-react';

interface AuditCertificateModalProps {
  fields: ExtractedFields;
  riskBreakdown: RiskScoreBreakdown;
  onClose: () => void;
  onExportJson: () => void;
}

export const AuditCertificateModal: React.FC<AuditCertificateModalProps> = ({
  fields,
  riskBreakdown,
  onClose,
  onExportJson
}) => {
  const isVerified = riskBreakdown.classification === 'VERIFIED';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '750px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          background: '#0a0f1d',
          border: '1.5px solid rgba(0, 242, 254, 0.4)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.85)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255,255,255,0.06)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          <X size={18} />
        </button>

        {/* Certificate Frame */}
        <div style={{
          border: '2px solid rgba(0, 242, 254, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '2rem',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.6) 0%, rgba(6, 12, 24, 0.9) 100%)',
          position: 'relative'
        }}>
          {/* Top Badge & Seal */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                <Award size={24} color="var(--cyan-primary)" />
                <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em', color: '#ffffff' }}>
                  VERIFAI AUDIT CERTIFICATE
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Zero-Trust Multi-Layer Identity &amp; Document Forensics Verification
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${
                isVerified ? 'badge-green' : 'badge-red'
              }`} style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}>
                {riskBreakdown.classification}
              </span>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '4px' }}>
                {riskBreakdown.auditId}
              </div>
            </div>
          </div>

          {/* Subject & Document Metadata */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            background: 'rgba(255,255,255,0.02)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subject Name</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>{fields.fullName}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Document Identifier</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)' }}>
                {fields.documentNumber}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Document Classification</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{fields.documentType} ({fields.issuingCountry})</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Verification Timestamp</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                {new Date(riskBreakdown.timestamp).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Layer Verification Scores Matrix */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>
              Multi-Layer Trust Scores
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
              <div style={{ background: '#040813', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>OCR (20%)</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>{riskBreakdown.layerScores.ocrAndConsistency}</div>
              </div>
              <div style={{ background: '#040813', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Forensics (30%)</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>{riskBreakdown.layerScores.documentForensics}</div>
              </div>
              <div style={{ background: '#040813', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Authority (25%)</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>{riskBreakdown.layerScores.authorityDatabase}</div>
              </div>
              <div style={{ background: '#040813', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Biometrics (25%)</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>{riskBreakdown.layerScores.biometricsLiveness}</div>
              </div>
            </div>
          </div>

          {/* Cryptographic Ledger Signature */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '1rem',
            fontSize: '0.72rem',
            color: 'var(--text-secondary)'
          }}>
            <div>
              <div>System Hash Proof:</div>
              <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan-primary)' }}>
                SHA-256: 3a7f89d0c2e4...e89b41
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div>Authorized Validator:</div>
              <div style={{ fontWeight: 700, color: '#f8fafc' }}>VERIFAI Neural Engine 2.4</div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          marginTop: '1.25rem'
        }}>
          <button onClick={onExportJson} className="btn btn-secondary">
            <Download size={15} />
            <span>Download JSON</span>
          </button>
          <button onClick={handlePrint} className="btn btn-primary">
            <Printer size={15} />
            <span>Print Official Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
