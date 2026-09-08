import React, { useState, useEffect } from 'react';
import type { ExtractedFields, ConsistencyCheckResult } from '../types';
import {
  FileText,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Barcode,
  Cpu,
  Edit3,
  Check,
  X
} from 'lucide-react';

interface OcrAnalysisStepProps {
  fields: ExtractedFields;
  consistency: ConsistencyCheckResult;
  onUpdateFields?: (fields: ExtractedFields) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const OcrAnalysisStep: React.FC<OcrAnalysisStepProps> = ({
  fields,
  consistency,
  onUpdateFields,
  onNext,
  onPrev
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [form, setForm] = useState<ExtractedFields>(fields);

  useEffect(() => {
    setForm(fields);
  }, [fields]);

  const handleSaveEdit = () => {
    if (onUpdateFields) {
      onUpdateFields(form);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setForm(fields);
    setIsEditing(false);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Step Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-cyan">Layer 2 of 6</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              Optical Character Recognition (OCR) &amp; Data Consistency
            </h2>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Extracts visual inspection zone fields, decodes ICAO Doc 9303 MRZ zones, and evaluates cross-field date logic.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className={`badge ${
            consistency.score >= 80 ? 'badge-green' : consistency.score >= 50 ? 'badge-amber' : 'badge-red'
          }`}>
            Consistency Score: {consistency.score}/100
          </span>
        </div>
      </div>

      <div className="grid-2">
        {/* Left: Extracted Visual Inspection Zone (VIZ) Fields */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="var(--cyan-primary)" />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                Extracted Visual Fields
              </span>
            </div>

            {onUpdateFields && (
              <button
                onClick={() => {
                  if (isEditing) {
                    handleCancelEdit();
                  } else {
                    setForm(fields);
                    setIsEditing(true);
                  }
                }}
                className="btn btn-secondary"
                style={{
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.72rem',
                  borderColor: isEditing ? 'var(--cyan-primary)' : 'var(--border-subtle)'
                }}
              >
                <Edit3 size={12} />
                <span>{isEditing ? 'Cancel Edit' : 'Edit Credentials'}</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <div style={{
              background: 'rgba(0, 242, 254, 0.04)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value.toUpperCase() })}
                    className="input-field"
                    style={{ width: '100%', fontSize: '0.85rem', padding: '0.4rem 0.6rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                    Document Identifier
                  </label>
                  <input
                    type="text"
                    value={form.documentNumber}
                    onChange={(e) => setForm({ ...form, documentNumber: e.target.value.toUpperCase() })}
                    className="input-field"
                    style={{ width: '100%', fontSize: '0.85rem', padding: '0.4rem 0.6rem', fontFamily: 'var(--font-mono)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    value={form.dateOfBirth}
                    onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', fontSize: '0.82rem', padding: '0.4rem 0.6rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                    Issuing Country
                  </label>
                  <input
                    type="text"
                    value={form.issuingCountry}
                    onChange={(e) => setForm({ ...form, issuingCountry: e.target.value.toUpperCase() })}
                    className="input-field"
                    style={{ width: '100%', fontSize: '0.82rem', padding: '0.4rem 0.6rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', fontSize: '0.82rem', padding: '0.4rem 0.6rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.4rem' }}>
                <button
                  onClick={handleCancelEdit}
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                >
                  <X size={12} />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="btn btn-primary"
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
                >
                  <Check size={12} />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Full Legal Name</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>{fields.fullName || '—'}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Document Identifier</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)' }}>
                    {fields.documentNumber || '—'}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                background: 'rgba(255,255,255,0.02)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date of Birth</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{fields.dateOfBirth}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Calculated Age</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: fields.age >= 18 ? 'var(--color-verified)' : 'var(--color-danger)' }}>
                    {fields.age} Years (Adult)
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gender</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{fields.gender}</div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                background: 'rgba(255,255,255,0.02)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Issuing Country</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{fields.issuingCountry}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Issuance Date</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{fields.issueDate}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Expiry Date</span>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: consistency.expiryValid ? 'var(--color-verified)' : 'var(--color-danger)'
                  }}>
                    {fields.expiryDate}
                  </div>
                </div>
              </div>
            </div>
          )}

            {/* MRZ Zone Decoder */}
            {fields.mrzLine1 && (
              <div style={{
                background: '#040813',
                border: '1px solid rgba(0,242,254,0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Barcode size={16} color="var(--cyan-primary)" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--cyan-primary)', textTransform: 'uppercase' }}>
                      ICAO Doc 9303 Machine Readable Zone (MRZ)
                    </span>
                  </div>
                  <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>TD3 Format</span>
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: '#cbd5e1',
                  letterSpacing: '0.12em',
                  lineHeight: 1.5,
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                  padding: '0.35rem 0'
                }}>
                  <div>{fields.mrzLine1}</div>
                  <div>{fields.mrzLine2}</div>
                </div>
              </div>
            )}
        </div>

        {/* Right: Validation & Consistency Rule Checklist */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={18} color="var(--cyan-primary)" />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                Consistency Validation Rules
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {consistency.passedCount}/{consistency.totalChecks} Rules Passed
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {consistency.details.map((rule, idx) => (
              <div
                key={idx}
                style={{
                  background: rule.passed
                    ? 'rgba(16, 185, 129, 0.05)'
                    : 'rgba(239, 68, 68, 0.08)',
                  border: rule.passed
                    ? '1px solid rgba(16, 185, 129, 0.25)'
                    : '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                <div style={{ marginTop: '2px' }}>
                  {rule.passed ? (
                    <CheckCircle2 size={16} color="var(--color-verified)" />
                  ) : (
                    <XCircle size={16} color="var(--color-danger)" />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: rule.passed ? '#ffffff' : '#fca5a5'
                  }}>
                    {rule.rule}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {rule.message}
                  </div>
                </div>
              </div>
            ))}
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
              <span>Back: Document</span>
            </button>

            <button onClick={onNext} className="btn btn-primary" style={{ fontSize: '0.82rem' }}>
              <span>Step 3: Document Forensics</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
