import {
  extractAnthropometricProfile,
  computeAnthropometricShapeDivergence,
  evaluateBiometrics
} from '../src/services/biometricsEngine';

console.log('=== VERIFAI BIOMETRICS CALIBRATION & DISCRIMINATION VERIFICATION ===\n');

// 1. Synthetic face profiles simulating Arijit Podder vs Imposter Woman
const size = 128;
const lumArijitCard = new Float32Array(size * size);
const lumArijitWebcam = new Float32Array(size * size);
const lumWomanWebcam = new Float32Array(size * size);

// Fill Arijit Card (narrow face: width 44%, jaw 32%, chin 88%)
for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const nx = (x - size / 2) / (size * 0.22);
    const ny = (y - size * 0.54) / (size * 0.35);
    if (nx * nx + ny * ny <= 1.0) {
      lumArijitCard[y * size + x] = 125;
    }
    if (y >= size * 0.35 && y <= size * 0.38 && Math.abs(x - size / 2) < size * 0.20) {
      lumArijitCard[y * size + x] = 55; // Eye trough
    }
    if (y >= size * 0.69 && y <= size * 0.72 && Math.abs(x - size / 2) < size * 0.15) {
      lumArijitCard[y * size + x] = 65; // Mouth trough
    }
  }
}

// Fill Arijit Live Webcam (same narrow geometry with slight lighting variation)
for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const nx = (x - size / 2) / (size * 0.23);
    const ny = (y - size * 0.55) / (size * 0.35);
    if (nx * nx + ny * ny <= 1.0) {
      lumArijitWebcam[y * size + x] = 135;
    }
    if (y >= size * 0.36 && y <= size * 0.39 && Math.abs(x - size / 2) < size * 0.21) {
      lumArijitWebcam[y * size + x] = 60; // Eye trough (with glasses frame)
    }
    if (y >= size * 0.70 && y <= size * 0.73 && Math.abs(x - size / 2) < size * 0.16) {
      lumArijitWebcam[y * size + x] = 70; // Mouth trough
    }
  }
}

// Fill Imposter Woman (wide round face: width 58%, jaw 50%, chin 80%)
for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const nx = (x - size / 2) / (size * 0.29);
    const ny = (y - size * 0.51) / (size * 0.29);
    if (nx * nx + ny * ny <= 1.0) {
      lumWomanWebcam[y * size + x] = 140;
    }
    if (y >= size * 0.36 && y <= size * 0.39 && Math.abs(x - size / 2) < size * 0.26) {
      lumWomanWebcam[y * size + x] = 70; // Eye trough
    }
    if (y >= size * 0.66 && y <= size * 0.69 && Math.abs(x - size / 2) < size * 0.22) {
      lumWomanWebcam[y * size + x] = 80; // Mouth trough
    }
  }
}

const profArijitCard = extractAnthropometricProfile(lumArijitCard, size);
const profArijitWebcam = extractAnthropometricProfile(lumArijitWebcam, size);
const profWomanWebcam = extractAnthropometricProfile(lumWomanWebcam, size);

const divSamePerson = computeAnthropometricShapeDivergence(profArijitCard, profArijitWebcam);
const divDifferentPerson = computeAnthropometricShapeDivergence(profArijitCard, profWomanWebcam);

console.log('1. Anthropometric Shape Divergence:');
console.log('   Arijit vs Arijit (Same Person):', (divSamePerson * 100).toFixed(1) + '%', divSamePerson <= 0.18 ? '✅ PASS (Consistent)' : '❌ FAIL');
console.log('   Arijit vs Woman (Imposter/Stranger):', (divDifferentPerson * 100).toFixed(1) + '%', divDifferentPerson > 0.18 ? '✅ PASS (Strictly Rejected)' : '❌ FALSE POSITIVE');

console.log('\n2. Biometric Decision Layer Verification:');
const genuineRes = evaluateBiometrics(94, true, ['Liveness', 'Face Match']);
console.log('   Genuine Match (94%):', genuineRes.matchPassed ? '✅ VERIFIED (PASS)' : '❌ FAIL');

const imposterRes = evaluateBiometrics(34, true, ['Liveness', 'Face Match']);
console.log('   Imposter Match (34%):', !imposterRes.matchPassed ? '✅ REJECTED (FAIL - MISMATCH DETECTED)' : '❌ FALSE POSITIVE');
