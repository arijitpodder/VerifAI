import type {
  AuthorityCheckResult,
  BiometricCheckResult,
  ConsistencyCheckResult,
  ForensicsResult,
  RiskClassification,
  RiskFactor,
  RiskScoreBreakdown,
  RiskSignal
} from '../types';

export function evaluateOverallRisk(
  consistency: ConsistencyCheckResult,
  forensics: ForensicsResult,
  authority: AuthorityCheckResult,
  biometrics: BiometricCheckResult
): RiskScoreBreakdown {
  const ocrScore = consistency.score;
  const forensicsScore = forensics.overallScore;
  const authorityScore = authority.score;
  const biometricsScore = biometrics.score;

  // Weighted calculation
  let calculatedScore = Math.round(
    ocrScore * 0.20 +
    forensicsScore * 0.30 +
    authorityScore * 0.25 +
    biometricsScore * 0.25
  );

  const positiveSignals: RiskSignal[] = [];
  const riskFactors: RiskFactor[] = [];

  // 1. OCR & Consistency Signals
  if (consistency.mrzChecksumValid) {
    positiveSignals.push({
      layer: 'OCR',
      title: 'ICAO Doc 9303 Checksum Validated',
      detail: '7-3-1 weight check digits match document machine-readable zone.'
    });
  } else {
    riskFactors.push({
      layer: 'OCR',
      severity: 'WARNING',
      title: 'MRZ Checksum Mismatch',
      detail: 'Calculated checksum fails ICAO Doc 9303 parity algorithm.'
    });
  }

  if (consistency.crossFieldParityValid) {
    positiveSignals.push({
      layer: 'OCR',
      title: 'Visual & MRZ Data Parity Confirmed',
      detail: 'Extracted visual text corresponds with encoded MRZ zone.'
    });
  } else {
    riskFactors.push({
      layer: 'OCR',
      severity: 'CRITICAL',
      title: 'Visual vs MRZ Cross-Parity Conflict',
      detail: 'Visual text does not align with data embedded in the machine zone.'
    });
  }

  if (consistency.expiryValid) {
    positiveSignals.push({
      layer: 'OCR',
      title: 'Document Unexpired',
      detail: 'Current timestamp is prior to official expiration date.'
    });
  } else {
    riskFactors.push({
      layer: 'OCR',
      severity: 'WARNING',
      title: 'Expired Identification Credential',
      detail: 'Document validity window has lapsed.'
    });
  }

  // 2. Forensics Signals
  if (!forensics.tamperingDetected && forensics.elaAnomalyScore < 25) {
    positiveSignals.push({
      layer: 'FORENSICS',
      title: 'Substrate & Compression Uniformity',
      detail: 'Error Level Analysis (ELA) delta < 25%. No resaved image tiles or splicing artifacts.'
    });
  } else {
    riskFactors.push({
      layer: 'FORENSICS',
      severity: 'CRITICAL',
      title: 'Digital Tampering & Splicing Detected',
      detail: `High Error Level Analysis disparity (${forensics.elaAnomalyScore}%) and edge gradient anomalies flag altered image sections.`
    });
  }

  if (forensics.edgeDiscontinuityScore < 25) {
    positiveSignals.push({
      layer: 'FORENSICS',
      title: 'Clean Typography & Boundary Continuity',
      detail: 'Sobel filter confirms natural boundary blending without cut-and-paste seams.'
    });
  } else {
    riskFactors.push({
      layer: 'FORENSICS',
      severity: 'CRITICAL',
      title: 'Discontinuous Edge Artifacts',
      detail: 'Rectangular boundary gradients around text/photo indicate digital insertion.'
    });
  }

  // 3. Authority Database Signals
  if (authority.activeStatus === 'ACTIVE' && !authority.interpolStolenRecord) {
    positiveSignals.push({
      layer: 'AUTHORITY',
      title: 'Government Registry Status Active',
      detail: `Verified against ${authority.registryName}. Record ID: ${authority.recordId}.`
    });
  } else if (authority.interpolStolenRecord || authority.activeStatus === 'STOLEN') {
    riskFactors.push({
      layer: 'AUTHORITY',
      severity: 'CRITICAL',
      title: 'INTERPOL Stolen Document Database Alert',
      detail: 'Document number is flagged on global law enforcement stolen/lost registry.'
    });
  } else if (authority.activeStatus === 'REVOKED') {
    riskFactors.push({
      layer: 'AUTHORITY',
      severity: 'CRITICAL',
      title: 'Credential Revoked by Issuing Authority',
      detail: 'Issuing government department has marked this record as cancelled or revoked.'
    });
  } else if (authority.activeStatus === 'EXPIRED') {
    riskFactors.push({
      layer: 'AUTHORITY',
      severity: 'WARNING',
      title: 'Registry Record Expired',
      detail: 'Government database flags credential as past expiration.'
    });
  }

  // 4. Biometrics Signals
  if (biometrics.matchPassed && biometrics.faceMatchScore >= 80) {
    positiveSignals.push({
      layer: 'BIOMETRICS',
      title: 'Facial Biometric Correlation Validated',
      detail: `${biometrics.faceMatchScore}% similarity index between live capture and ID portrait.`
    });
  } else if (!biometrics.matchPassed) {
    riskFactors.push({
      layer: 'BIOMETRICS',
      severity: 'CRITICAL',
      title: 'Biometric Impersonation Alert',
      detail: `Live presenter failed facial comparison test (${biometrics.faceMatchScore}% similarity vs 70% threshold).`
    });
  }

  if (biometrics.livenessPassed) {
    positiveSignals.push({
      layer: 'BIOMETRICS',
      title: 'Live Presence Confirmed',
      detail: `Completed dynamic liveness micro-challenges (${biometrics.challengesCompleted.join(', ')}).`
    });
  } else {
    riskFactors.push({
      layer: 'BIOMETRICS',
      severity: 'WARNING',
      title: 'Liveness Check Incomplete',
      detail: 'User failed or bypassed live presence challenge.'
    });
  }

  // Enforce Hard Red-Line Security Rules (Zero Tolerance)
  const hasCriticalRisk = riskFactors.some((rf) => rf.severity === 'CRITICAL');
  if (hasCriticalRisk) {
    calculatedScore = Math.min(calculatedScore, 44);
  }

  // Classification Thresholds
  let classification: RiskClassification = 'VERIFIED';
  let recommendation = 'Auto-approval recommended. Document and identity pass all multi-layer integrity standards.';

  if (calculatedScore < 50 || hasCriticalRisk) {
    classification = 'HIGH_RISK';
    recommendation = 'IMMEDIATE ESCALATION / REJECTION: High risk of fraud or credential tampering detected. Transaction suspended.';
  } else if (calculatedScore < 85) {
    classification = 'REVIEW_REQUIRED';
    recommendation = 'MANUAL COMPLIANCE REVIEW: Secondary officer review required due to minor discrepancies or marginal scores.';
  }

  const auditId = 'VRF-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const timestamp = new Date().toISOString();

  return {
    totalScore: calculatedScore,
    classification,
    layerScores: {
      ocrAndConsistency: ocrScore,
      documentForensics: forensicsScore,
      authorityDatabase: authorityScore,
      biometricsLiveness: biometricsScore
    },
    positiveSignals,
    riskFactors,
    recommendation,
    auditId,
    timestamp
  };
}
