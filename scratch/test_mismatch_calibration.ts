// Verification test for mismatch calibration logic

function calibrateScores(rawCompositeScore: number, passThreshold: number, subScores: Record<string, number>) {
  const matchPassed = rawCompositeScore >= passThreshold;
  
  let similarityScore: number;
  if (matchPassed) {
    similarityScore = rawCompositeScore;
  } else {
    // Mismatch: scale to low mismatch tier (18% - 36%)
    const failRatio = Math.max(0, Math.min(0.98, rawCompositeScore / passThreshold));
    similarityScore = Math.max(18, Math.min(36, Math.round(18 + failRatio * 16)));
  }

  const calSubScore = (score: number) => {
    if (matchPassed || score <= 15) return score;
    return Math.max(15, Math.min(44, Math.round(score * 0.40 + 4)));
  };

  const calibratedSubScores: Record<string, number> = {};
  for (const [k, v] of Object.entries(subScores)) {
    calibratedSubScores[k] = calSubScore(v);
  }

  return { matchPassed, similarityScore, calibratedSubScores };
}

// Case 1: Screenshot 1 (Mismatch - raw score was 68%, threshold 70%)
console.log('=== Case 1: Screenshot 1 (Biometric Mismatch) ===');
const sc1SubScores = {
  mesh: 74,
  proportions: 57,
  color: 99,
  contour: 68,
  region: 80,
  ssim: 3,
  asymmetry: 100,
  zDepth: 0,
  aspectRatio: 93,
  microDist: 54
};
const res1 = calibrateScores(68, 70, sc1SubScores);
console.log('Match Passed:', res1.matchPassed ? 'YES' : 'NO (FAIL)');
console.log('Similarity Score:', res1.similarityScore + '% (Expected: 30%-36%, NOT 68%)');
console.log('Calibrated Subscores:', res1.calibratedSubScores);

// Case 2: Screenshot 2 (Genuine Match Pass - raw score was 76%, threshold 70%)
console.log('\n=== Case 2: Screenshot 2 (Genuine Match Pass) ===');
const sc2SubScores = {
  mesh: 98,
  proportions: 78,
  color: 76,
  contour: 91,
  region: 82,
  ssim: 6,
  asymmetry: 100,
  zDepth: 80,
  aspectRatio: 94,
  microDist: 41
};
const res2 = calibrateScores(76, 70, sc2SubScores);
console.log('Match Passed:', res2.matchPassed ? 'YES (PASS)' : 'NO');
console.log('Similarity Score:', res2.similarityScore + '% (Expected: EXACTLY 76%)');
console.log('Mesh Score:', res2.calibratedSubScores.mesh + '% (Expected: EXACTLY 98%)');
console.log('Proportions Score:', res2.calibratedSubScores.proportions + '% (Expected: EXACTLY 78%)');

// Case 3: Severe Mismatch (e.g. raw score 35%)
console.log('\n=== Case 3: Severe Mismatch (raw 35%) ===');
const res3 = calibrateScores(35, 70, { mesh: 30, proportions: 25 });
console.log('Match Passed:', res3.matchPassed ? 'YES' : 'NO (FAIL)');
console.log('Similarity Score:', res3.similarityScore + '% (Expected: 20%-28%)');
