import React from 'react';
import {
  X,
  Layers,
  Cpu,
  Key,
  Wifi,
  Eye,
  Shield
} from 'lucide-react';

interface ArchitectureModalProps {
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ onClose }) => {
  const modules = [
    {
      icon: Wifi,
      title: 'NFC & e-MRTD Contactless Chip Reader',
      category: 'Hardware & Cryptography Layer',
      status: 'Roadmap v3.0',
      description: 'Reads encrypted e-Passport and national ID microchips using ISO/IEC 14443 Type A/B protocols. Implements Basic Access Control (BAC) and Password Authenticated Connection Establishment (PACE). Extracts cryptographically signed JPEG2000 biometric facial images directly from secure enclave DG2.'
    },
    {
      icon: Key,
      title: 'Digital Signatures & Sovereign PKI Verification',
      category: 'Trust Anchor Layer',
      status: 'Ready for Integration',
      description: 'Validates X.509 digital certificates and Document Signer (DS) signatures against the ICAO Public Key Directory (PKD) and national Country Signing Certificate Authority (CSCA) master lists. Verifies non-repudiation and detects expired or revoked root authority certificates.'
    },
    {
      icon: Cpu,
      title: 'Neural Vision-Transformer Forensics',
      category: 'Deep Document Forensics',
      status: 'Prototype Deployed',
      description: 'Utilizes fine-tuned Swin-Transformer networks to detect synthetic generative replacements, localized color space manipulations, font rasterization artifacts, and microprint security strip discontinuity down to 600 DPI resolution.'
    },
    {
      icon: Eye,
      title: '3D Depth & Synthetic Deepfake Defense',
      category: 'Advanced Biometric Security',
      status: 'Roadmap v3.1',
      description: 'Extends device webcam biometrics with infrared depth estimation, photoplethysmography (rPPG pulse detection through skin pixel blood flow), and frequency-domain artifact analysis to prevent silicon masks, video replays, and real-time generative deepfakes.'
    },
    {
      icon: Shield,
      title: 'Global Government Gateway Adapters',
      category: 'Enterprise Integration Layer',
      status: 'Modular API Connectors',
      description: 'Plug-and-play middleware integrating directly with sovereign identity infrastructures: eIDAS (European Union), Aadhaar/DigiLocker (India), AAMVA Driver License Data Verification (USA), and Gov.UK One Login.'
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '88vh',
          overflowY: 'auto',
          padding: '2rem',
          background: '#090e1a',
          border: '1.5px solid rgba(0, 242, 254, 0.4)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <Layers size={24} color="var(--cyan-primary)" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
            VERIFAI Modular Platform Architecture
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
          Designed from the ground up as an extensible enterprise platform. Future iterations seamlessly plug in
          cryptographic chip decryption, government-grade PKI, and specialized deepfake biometric defense models.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <div
                key={i}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'rgba(0, 242, 254, 0.1)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={20} color="var(--cyan-primary)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc' }}>
                      {mod.title}
                    </h3>
                    <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                      {mod.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)', marginBottom: '0.45rem' }}>
                    {mod.category}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {mod.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <span>Standard Compliance: ICAO 9303, ISO/IEC 19794-5, NIST SP 800-63A</span>
          <button onClick={onClose} className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}>
            Close Architecture Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
