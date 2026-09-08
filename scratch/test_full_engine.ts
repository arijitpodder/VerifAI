// Simulation test for full biometricsEngine logic

interface LandmarkCoords {
  eyeY: number;
  noseY: number;
  mouthY: number;
  chinY: number;
  eyeWidth: number;
  cheekWidth: number;
  jawWidth: number;
}

function extractProfileFromLuminance(lum: Float32Array, size: number): LandmarkCoords {
  const rowLum = new Float32Array(size);
  const rowEdge = new Float32Array(size);
  const centerX = Math.round(size / 2);

  for (let y = 1; y < size - 1; y++) {
    let sumL = 0;
    let sumE = 0;
    let cnt = 0;
    const startX = Math.round(size * 0.30);
    const endX = Math.round(size * 0.70);

    for (let x = startX; x < endX; x++) {
      const idx = y * size + x;
      sumL += lum[idx];
      const dy = lum[(y + 1) * size + x] - lum[(y - 1) * size + x];
      sumE += Math.abs(dy);
      cnt++;
    }
    rowLum[y] = sumL / (cnt || 1);
    rowEdge[y] = sumE / (cnt || 1);
  }

  // Eye level: lowest luminance valley with horizontal edges
  let bestEyeY = Math.round(size * 0.36);
  let minEyeScore = Infinity;
  for (let y = Math.round(size * 0.28); y <= Math.round(size * 0.46); y++) {
    const score = rowLum[y] - rowEdge[y] * 1.5;
    if (score < minEyeScore) {
      minEyeScore = score;
      bestEyeY = y;
    }
  }

  // Nose level: transition from bright nasal bridge to nostril base
  let bestNoseY = Math.round(size * 0.54);
  let maxNoseScore = -Infinity;
  for (let y = bestEyeY + Math.round(size * 0.12); y <= Math.round(size * 0.64); y++) {
    const score = rowLum[y - 1] - rowLum[y + 1];
    if (score > maxNoseScore) {
      maxNoseScore = score;
      bestNoseY = y;
    }
  }

  // Mouth level: horizontal dark trough
  let bestMouthY = Math.round(size * 0.70);
  let minMouthScore = Infinity;
  for (let y = bestNoseY + Math.round(size * 0.10); y <= Math.round(size * 0.80); y++) {
    const score = rowLum[y] - rowEdge[y] * 2.0;
    if (score < minMouthScore) {
      minMouthScore = score;
      bestMouthY = y;
    }
  }

  // Chin level: lower edge of chin
  let bestChinY = Math.round(size * 0.88);
  for (let y = bestMouthY + Math.round(size * 0.08); y <= Math.round(size * 0.94); y++) {
    if (rowLum[y] < rowLum[y - 1] * 0.85) {
      bestChinY = y;
      break;
    }
  }

  // Measure widths:
  const getWidthAtY = (y: number): number => {
    let left = centerX;
    let right = centerX;
    for (let x = centerX; x >= Math.round(size * 0.15); x--) {
      if (lum[y * size + x] > 30) left = x;
      else break;
    }
    for (let x = centerX; x <= Math.round(size * 0.85); x++) {
      if (lum[y * size + x] > 30) right = x;
      else break;
    }
    return Math.max(10, right - left);
  };

  const eyeWidth = getWidthAtY(bestEyeY);
  const cheekWidth = getWidthAtY(bestNoseY);
  const jawWidth = getWidthAtY(bestMouthY);

  return {
    eyeY: bestEyeY / size,
    noseY: bestNoseY / size,
    mouthY: bestMouthY / size,
    chinY: bestChinY / size,
    eyeWidth: eyeWidth / size,
    cheekWidth: cheekWidth / size,
    jawWidth: jawWidth / size
  };
}

// Generate test faces:
const size = 128;
const lumArijit = new Float32Array(size * size);
const lumWoman = new Float32Array(size * size);

// Fill Arijit: narrow face (w: 0.46, jaw: 0.32, h: 0.88 - 0.36 = 0.52)
for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const nx = (x - size / 2) / (size * 0.23);
    const ny = (y - size * 0.55) / (size * 0.35);
    if (nx * nx + ny * ny <= 1.0) {
      lumArijit[y * size + x] = 120;
    }
    // Eye dark trough
    if (y >= size * 0.35 && y <= size * 0.38 && Math.abs(x - size / 2) < size * 0.22) {
      lumArijit[y * size + x] = 60;
    }
    // Mouth trough
    if (y >= size * 0.69 && y <= size * 0.72 && Math.abs(x - size / 2) < size * 0.16) {
      lumArijit[y * size + x] = 70;
    }
  }
}

// Fill Woman: round wide face (w: 0.56, jaw: 0.50, h: 0.82 - 0.37 = 0.45)
for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const nx = (x - size / 2) / (size * 0.29);
    const ny = (y - size * 0.52) / (size * 0.29);
    if (nx * nx + ny * ny <= 1.0) {
      lumWoman[y * size + x] = 135;
    }
    // Eye dark trough
    if (y >= size * 0.36 && y <= size * 0.39 && Math.abs(x - size / 2) < size * 0.25) {
      lumWoman[y * size + x] = 75;
    }
    // Mouth trough
    if (y >= size * 0.66 && y <= size * 0.69 && Math.abs(x - size / 2) < size * 0.22) {
      lumWoman[y * size + x] = 80;
    }
  }
}

const pArijit = extractProfileFromLuminance(lumArijit, size);
const pWoman = extractProfileFromLuminance(lumWoman, size);

console.log('Extracted Profile Arijit:', pArijit);
console.log('Extracted Profile Woman:', pWoman);

const elongA = (pArijit.chinY - pArijit.eyeY) / pArijit.cheekWidth;
const elongW = (pWoman.chinY - pWoman.eyeY) / pWoman.cheekWidth;
const taperA = pArijit.jawWidth / pArijit.cheekWidth;
const taperW = pWoman.jawWidth / pWoman.cheekWidth;

console.log('Arijit: Elongation =', elongA.toFixed(2), 'Jaw Taper =', taperA.toFixed(2));
console.log('Woman: Elongation =', elongW.toFixed(2), 'Jaw Taper =', taperW.toFixed(2));

const diffE = Math.abs(elongA - elongW) / Math.max(elongA, elongW);
const diffT = Math.abs(taperA - taperW) / Math.max(taperA, taperW);
const shapeDiv = diffE * 0.45 + diffT * 0.35;
console.log('Shape Divergence:', (shapeDiv * 100).toFixed(1) + '%');
console.log('Shape Test Rejects Woman:', shapeDiv > 0.18 ? '✅ PASS' : '❌ FAIL');
