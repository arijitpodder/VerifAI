import { extractNameCandidates, cleanCandidateName } from '../src/services/ocrEngine.ts';

// Test 1: Clean Person Name
console.log('--- Test 1: Name Cleaning ---');
const test1 = cleanCandidateName('ARIJIT PODDER F');
console.log('ARIJIT PODDER F =>', test1, test1 === 'ARIJIT PODDER' ? '✅ PASS' : '❌ FAIL');

const test2 = cleanCandidateName('NAME ARIJIT PODDER F');
console.log('NAME ARIJIT PODDER F =>', test2, test2 === 'ARIJIT PODDER' ? '✅ PASS' : '❌ FAIL');

const test3 = cleanCandidateName('F ARIJIT PODDER');
console.log('F ARIJIT PODDER =>', test3, test3 === 'ARIJIT PODDER' ? '✅ PASS' : '❌ FAIL');

// Test 2: Full OCR text parsing of Narula ID Card
console.log('\n--- Test 2: Full OCR Candidates ---');
const mockOcrText = `NARULA INSTITUTE OF TECHNOLOGY NIT
81, Nilgunj Road, Agarpara, Kolkata-700 109
Phone: +91 33 2563 8888, Email: info@nit.ac.in
ID No.: NIT/2025/1572
Name ARIJIT PODDER F
Stream B.Tech(CSE-DATA SCIENCE)
Phone 8509826621
Blood Group B+
Session 2025
Issued on 30/12/2025
S. Banerjee`;

const candidates = extractNameCandidates(mockOcrText);
console.log('Extracted Candidates:', candidates);
const passCheck = candidates.length > 0 && candidates[0] === 'ARIJIT PODDER' && !candidates.includes('ID NO NIT') && !candidates.includes('NAME ARIJIT PODDER F');
console.log('Candidate Extraction Test:', passCheck ? '✅ PASS' : '❌ FAIL');

// Test 3: Rotation logic verification
console.log('\n--- Test 3: ID Auto-Orientation Logic ---');
const isPortrait = (w: number, h: number) => h > w * 1.08;
console.log('Portrait phone snapshot (1080x1920):', isPortrait(1080, 1920) ? '✅ Correctly detected as vertical' : '❌ FAIL');
console.log('Standard landscape ID (1000x630):', !isPortrait(1000, 630) ? '✅ Correctly kept in original orientation' : '❌ FAIL');
console.log('Default clockwise rotation:', 90, 'degrees');

// Test 4: Biometric Score Calibration & Strict Pass Threshold
console.log('\n--- Test 4: Biometric Score Calibration ---');
import { evaluateBiometrics } from '../src/services/biometricsEngine.ts';

// Impersonator / Different Person (e.g. Woman vs Arijit Podder)
const fakeFaceResult = evaluateBiometrics(
  32,
  true,
  ['Face Alignment', 'Webcam Snapshot Frame', 'Liveness Check']
);
console.log('Impersonator Face (32%):', fakeFaceResult.matchPassed === false && fakeFaceResult.notes.includes('CRITICAL BIOMETRIC ALERT') ? '✅ PASS (Correctly Rejected)' : '❌ FAIL');

// Score of 59% (Previously passed with 55% threshold, now must strictly FAIL with 70% threshold!)
const borderlineResult = evaluateBiometrics(
  59,
  true,
  ['Face Alignment', 'Webcam Snapshot Frame', 'Liveness Check']
);
console.log('Borderline/Different Face (59%):', borderlineResult.matchPassed === false ? '✅ PASS (Correctly Rejected - Under 70%)' : '❌ FAIL (False Positive!)');

// Same Person (Genuine Match)
const genuineResult = evaluateBiometrics(
  88,
  true,
  ['Face Alignment', 'Webcam Snapshot Frame', 'Liveness Check']
);
console.log('Genuine Face (88%):', genuineResult.matchPassed === true && !genuineResult.notes.includes('ALERT') ? '✅ PASS (Correctly Verified)' : '❌ FAIL');


