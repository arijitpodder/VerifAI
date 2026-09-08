export type DocumentType = 'PASSPORT' | 'NATIONAL_ID' | 'DRIVERS_LICENSE';

export interface ExtractedFields {
  fullName: string;
  documentNumber: string;
  dateOfBirth: string;
  age: number;
  nationality: string;
  issuingCountry: string;
  issueDate: string;
  expiryDate: string;
  gender: 'M' | 'F' | 'X';
  documentType: DocumentType;
  mrzLine1?: string;
  mrzLine2?: string;
  confidenceScores: Record<string, number>;
}

export interface ConsistencyCheckResult {
  expiryValid: boolean;
  issueDateValid: boolean;
  ageValid: boolean;
  docNumberFormatValid: boolean;
  mrzChecksumValid: boolean;
  crossFieldParityValid: boolean;
  passedCount: number;
  totalChecks: number;
  score: number; // 0-100
  details: Array<{ rule: string; passed: boolean; message: string }>;
}

export interface FlaggedForensicRegion {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface ForensicsResult {
  overallScore: number; // 0-100 (100 = perfectly clean, no tampering)
  tamperingDetected: boolean;
  elaAnomalyScore: number; // 0-100 (higher = more anomaly)
  edgeDiscontinuityScore: number;
  noiseInconsistencyScore: number;
  fontUniformityScore: number;
  flaggedRegions: FlaggedForensicRegion[];
  summary: string;
  elaImageDataUrl?: string;
  edgeImageDataUrl?: string;
}

export type AuthorityRecordStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'STOLEN' | 'NOT_FOUND';

export interface AuthorityCheckResult {
  queryStatus: 'MATCH_FOUND' | 'NOT_FOUND' | 'FLAGGED_REVOKED' | 'FLAGGED_STOLEN';
  registryName: string;
  recordId: string;
  issuedTo: string;
  activeStatus: AuthorityRecordStatus;
  interpolStolenRecord: boolean;
  issuanceTimestamp: string;
  queryLatencyMs: number;
  ledgerTxHash: string;
  score: number; // 0-100
  notes: string;
  databaseJurisdiction: string;
}

export interface BiometricCheckResult {
  livenessPassed: boolean;
  livenessScore: number; // 0-100
  faceMatchScore: number; // 0-100
  biometricConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'FAIL';
  challengesCompleted: string[];
  docFaceCroppedUrl?: string;
  liveFaceCapturedUrl?: string;
  matchPassed: boolean;
  score: number; // 0-100 combined
  notes: string;
  isSimulated?: boolean;
}

export type RiskClassification = 'VERIFIED' | 'REVIEW_REQUIRED' | 'HIGH_RISK';

export interface RiskSignal {
  title: string;
  detail: string;
  layer: 'OCR' | 'FORENSICS' | 'AUTHORITY' | 'BIOMETRICS';
}

export interface RiskFactor {
  title: string;
  detail: string;
  layer: 'OCR' | 'FORENSICS' | 'AUTHORITY' | 'BIOMETRICS';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
}

export interface RiskScoreBreakdown {
  totalScore: number; // 0-100
  classification: RiskClassification;
  layerScores: {
    ocrAndConsistency: number; // 20%
    documentForensics: number;  // 30%
    authorityDatabase: number;  // 25%
    biometricsLiveness: number; // 25%
  };
  positiveSignals: RiskSignal[];
  riskFactors: RiskFactor[];
  recommendation: string;
  auditId: string;
  timestamp: string;
}

export interface PresetSample {
  id: string;
  name: string;
  subtitle: string;
  expectedResult: RiskClassification;
  badgeText: string;
  badgeType: 'verified' | 'warning' | 'danger';
  docImageSvg: string;
  portraitSvg: string;
  liveCapturedSvg: string;
  extractedFields: ExtractedFields;
  forensicsPreset: {
    tampered: boolean;
    tamperRegions: FlaggedForensicRegion[];
    anomalyDescription: string;
    elaModifier: number;
  };
  authorityPreset: {
    status: AuthorityRecordStatus;
    interpolStolen: boolean;
    notes: string;
  };
  biometricsPreset: {
    matchScore: number;
    notes: string;
    faceDiscrepancy?: string;
  };
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  documentNumber: string;
  subjectName: string;
  documentType: DocumentType;
  riskClassification: RiskClassification;
  totalScore: number;
  sha256Hash: string;
  officerNotes?: string;
}
