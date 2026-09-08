import React from 'react';
import { ShieldCheck, FileText, Layers, Scan, UserCheck } from 'lucide-react';

export type AppMode = 'PIPELINE' | 'ID_LAB' | 'FACE_LAB' | 'ID_FACE_MATCH';

interface NavbarProps {
  onOpenArchitecture: () => void;
  onOpenAuditLog: () => void;
  auditCount: number;
  activeMode: AppMode;
  onChangeMode: (mode: AppMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenArchitecture,
  onOpenAuditLog,
  auditCount,
  activeMode,
  onChangeMode
}) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(6, 9, 19, 0.88)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.75rem 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(0,242,254,0.2) 0%, rgba(99,102,241,0.2) 100%)',
            border: '1px solid rgba(0,242,254,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-neon-cyan)'
          }}>
            <ShieldCheck size={24} color="var(--cyan-primary)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(120deg, #ffffff 30%, #00f2fe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'var(--font-sans)'
              }}>
                VERIFAI
              </span>
              <span className="badge badge-cyan" style={{ fontSize: '0.62rem', padding: '0.12rem 0.45rem' }}>
                v2.5 PRO
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0 }}>
              AI Multi-Layer Identity &amp; Forensics
            </p>
          </div>
        </div>

        {/* Primary Mode Switcher */}
        <div style={{
          display: 'flex',
          background: '#040813',
          padding: '0.3rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(0, 242, 254, 0.25)',
          gap: '0.35rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => onChangeMode('ID_FACE_MATCH')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.95rem',
              borderRadius: 'var(--radius-sm)',
              border: activeMode === 'ID_FACE_MATCH' ? 'none' : '1px solid rgba(0, 242, 254, 0.4)',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 800,
              background: activeMode === 'ID_FACE_MATCH'
                ? 'linear-gradient(135deg, #00f2fe, #10b981)'
                : 'rgba(0, 242, 254, 0.1)',
              color: activeMode === 'ID_FACE_MATCH' ? '#050b14' : '#00f2fe',
              transition: 'all 0.2s ease',
              boxShadow: activeMode === 'ID_FACE_MATCH' ? '0 0 15px rgba(0, 242, 254, 0.4)' : 'none'
            }}
          >
            <UserCheck size={15} />
            <span>ID &amp; Live Face Match</span>
            <span style={{
              background: activeMode === 'ID_FACE_MATCH' ? '#050b14' : 'var(--cyan-primary)',
              color: activeMode === 'ID_FACE_MATCH' ? 'var(--cyan-primary)' : '#050b14',
              padding: '0.05rem 0.35rem',
              borderRadius: '4px',
              fontSize: '0.62rem',
              fontWeight: 800
            }}>
              STAR
            </span>
          </button>

          <button
            onClick={() => onChangeMode('PIPELINE')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: activeMode === 'PIPELINE' ? 'linear-gradient(135deg, #00f2fe, #38bdf8)' : 'transparent',
              color: activeMode === 'PIPELINE' ? '#050b14' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            <Scan size={14} />
            <span>Full Forensics Pipeline</span>
          </button>

          <button
            onClick={() => onChangeMode('ID_LAB')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: activeMode === 'ID_LAB' ? 'linear-gradient(135deg, #00f2fe, #38bdf8)' : 'transparent',
              color: activeMode === 'ID_LAB' ? '#050b14' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            <FileText size={14} />
            <span>ID Lab</span>
          </button>

          <button
            onClick={() => onChangeMode('FACE_LAB')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: activeMode === 'FACE_LAB' ? 'linear-gradient(135deg, #00f2fe, #38bdf8)' : 'transparent',
              color: activeMode === 'FACE_LAB' ? '#050b14' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            <UserCheck size={14} />
            <span>Face Lab</span>
          </button>
        </div>

        {/* Header Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={onOpenAuditLog}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
          >
            <FileText size={14} />
            <span>Audit Ledger</span>
            {auditCount > 0 && (
              <span style={{
                background: 'var(--cyan-primary)',
                color: '#050b14',
                padding: '0.05rem 0.4rem',
                borderRadius: '99px',
                fontSize: '0.68rem',
                fontWeight: 700
              }}>
                {auditCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenArchitecture}
            className="btn btn-secondary"
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.78rem',
              borderColor: 'rgba(0, 242, 254, 0.3)',
              background: 'rgba(0, 242, 254, 0.06)'
            }}
          >
            <Layers size={14} color="var(--cyan-primary)" />
            <span style={{ color: 'var(--cyan-primary)' }}>Architecture</span>
          </button>
        </div>
      </div>
    </header>
  );
};
