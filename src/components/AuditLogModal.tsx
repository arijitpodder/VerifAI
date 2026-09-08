import React from 'react';
import type { AuditRecord } from '../types';
import { X, FileText } from 'lucide-react';

interface AuditLogModalProps {
  logs: AuditRecord[];
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ logs, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '2rem',
          background: '#090e1a',
          border: '1.5px solid rgba(0, 242, 254, 0.4)',
          position: 'relative'
        }}
      >
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
          <FileText size={22} color="var(--cyan-primary)" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
            Compliance &amp; Verification Audit Trail
          </h2>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Chronological record of processed identification credentials with SHA-256 integrity proofs.
        </p>

        {logs.length === 0 ? (
          <div style={{
            padding: '3rem 1.5rem',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              No audit logs recorded yet in this session. Run a verification check to populate the audit ledger.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {logs.map((log) => (
              <div
                key={log.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
                      {log.subjectName}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)' }}>
                      [{log.documentNumber}]
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Type: {log.documentType} • Time: {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    Hash: {log.sha256Hash.substring(0, 24)}...
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: log.riskClassification === 'VERIFIED' ? 'var(--color-verified)' : 'var(--color-danger)' }}>
                      {log.totalScore}/100
                    </div>
                    <span className={`badge ${
                      log.riskClassification === 'VERIFIED' ? 'badge-green' : 'badge-red'
                    }`} style={{ fontSize: '0.65rem' }}>
                      {log.riskClassification}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
            Close Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
};
