import React from 'react';
import type { AuthorityCheckResult } from '../types';
import {
  Server,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Hash,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface AuthorityCheckStepProps {
  authority: AuthorityCheckResult;
  onNext: () => void;
  onPrev: () => void;
}

export const AuthorityCheckStep: React.FC<AuthorityCheckStepProps> = ({
  authority,
  onNext,
  onPrev
}) => {
  const isStolenOrRevoked =
    authority.interpolStolenRecord ||
    authority.activeStatus === 'STOLEN' ||
    authority.activeStatus === 'REVOKED';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-cyan">Layer 4 of 6</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              Simulated Authority Registry &amp; INTERPOL SLTD Check
            </h2>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Cross-references document number and cryptographic signature against simulated government databases and stolen registries.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className={`badge ${
            isStolenOrRevoked ? 'badge-red' : authority.activeStatus === 'ACTIVE' ? 'badge-green' : 'badge-amber'
          }`}>
            Authority Status: {authority.activeStatus}
          </span>
        </div>
      </div>

      <div className="grid-2">
        {/* Left: Terminal Query Stream & Registry Status Card */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server size={18} color="var(--cyan-primary)" />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                Registry Verification Terminal
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <Clock size={13} />
              <span>Latency: {authority.queryLatencyMs}ms</span>
            </div>
          </div>

          {/* Terminal Console */}
          <div className="terminal-box" style={{ marginBottom: '1.25rem', minHeight: '140px' }}>
            <div style={{ color: '#64748b' }}>// VERIFAI Authority Gateway API v2.4</div>
            <div style={{ color: '#38bdf8' }}>&gt; CONNECTING to {authority.registryName}... [TLS 1.3 ESTABLISHED]</div>
            <div style={{ color: '#cbd5e1' }}>&gt; QUERY PARAMS: RecordID={authority.recordId} | Jurisdiction={authority.databaseJurisdiction}</div>
            <div style={{ color: '#38bdf8' }}>&gt; QUERYING INTERPOL Stolen and Lost Travel Documents (SLTD) Gateway...</div>
            {authority.interpolStolenRecord ? (
              <div style={{ color: '#ef4444', fontWeight: 700 }}>
                &gt; [ALERT] INTERPOL SLTD MATCH FOUND: Document flagged as STOLEN. Immediate flag recorded.
              </div>
            ) : (
              <div style={{ color: '#10b981' }}>
                &gt; INTERPOL SLTD: Zero hits. Document not reported lost or stolen.
              </div>
            )}
            <div style={{ color: '#38bdf8' }}>&gt; RESOLUTION STATUS: {authority.activeStatus} (Tx: {authority.ledgerTxHash.substring(0, 16)}...)</div>
          </div>

          {/* Status Highlight Banner */}
          <div style={{
            background: isStolenOrRevoked
              ? 'rgba(239, 68, 68, 0.12)'
              : 'rgba(16, 185, 129, 0.08)',
            border: isStolenOrRevoked
              ? '1.5px solid rgba(239, 68, 68, 0.4)'
              : '1.5px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem'
          }}>
            <div style={{ marginTop: '2px' }}>
              {isStolenOrRevoked ? (
                <ShieldAlert size={24} color="var(--color-danger)" />
              ) : (
                <ShieldCheck size={24} color="var(--color-verified)" />
              )}
            </div>
            <div>
              <div style={{
                fontSize: '0.92rem',
                fontWeight: 700,
                color: isStolenOrRevoked ? '#fca5a5' : '#86efac'
              }}>
                {isStolenOrRevoked ? 'CRITICAL AUTHORITY ALERT' : 'GOVERNMENT REGISTRY VALIDATED'}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                {authority.notes}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Record Metadata & Cryptographic Proof */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
            Authority Ledger Record
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Connected Registry</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>{authority.registryName}</div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              background: 'rgba(255,255,255,0.02)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Record ID</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)' }}>
                  {authority.recordId}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Issued Subject</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                  {authority.issuedTo}
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.02)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '3px' }}>
                <Hash size={13} color="var(--cyan-primary)" />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Cryptographic Ledger Proof (SHA-256)
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                {authority.ledgerTxHash}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              background: 'rgba(255,255,255,0.02)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>INTERPOL SLTD Status</div>
                <div style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: authority.interpolStolenRecord ? 'var(--color-danger)' : 'var(--color-verified)'
                }}>
                  {authority.interpolStolenRecord ? 'RED HIT (STOLEN)' : 'CLEAR (NO HIT)'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Jurisdiction</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
                  {authority.databaseJurisdiction}
                </div>
              </div>
            </div>
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
              <span>Back: Forensics</span>
            </button>

            <button onClick={onNext} className="btn btn-primary" style={{ fontSize: '0.82rem' }}>
              <span>Step 5: Webcam Biometrics</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
