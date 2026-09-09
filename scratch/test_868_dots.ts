// Test 868 dense landmark generation and strict discrimination

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export function densifyFaceMesh(baseMarks: Point3D[]): Point3D[] {
  if (!baseMarks || baseMarks.length === 0) return [];
  if (baseMarks.length < 468) {
    return [...baseMarks];
  }

  const result: Point3D[] = baseMarks.map(m => ({ x: m.x, y: m.y, z: m.z || 0 }));
  const lerp = (p1: Point3D, p2: Point3D, t: number): Point3D => ({
    x: p1.x * (1 - t) + p2.x * t,
    y: p1.y * (1 - t) + p2.y * t,
    z: (p1.z || 0) * (1 - t) + (p2.z || 0) * t
  });

  // 1. Jawline contour (36 segments, 2 intermediate points each = 72 points)
  const jawIndices = [
    10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378,
    400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21,
    54, 103, 67, 109, 10
  ];
  for (let i = 0; i < jawIndices.length - 1; i++) {
    const a = baseMarks[jawIndices[i]];
    const b = baseMarks[jawIndices[i + 1]];
    if (a && b) {
      result.push(lerp(a, b, 0.333));
      result.push(lerp(a, b, 0.667));
    }
  }

  // 2. Forehead & hairline cranial curve (22 segments x 2 = 44 points)
  const foreheadIndices = [
    10, 338, 297, 332, 284, 251, 389, 356, 454, // Right top arc
    109, 67, 103, 54, 21, 162, 127, 234, // Left top arc
    151, 9, 8, 168, 6 // Midline forehead
  ];
  for (let i = 0; i < foreheadIndices.length - 1; i++) {
    const a = baseMarks[foreheadIndices[i]];
    const b = baseMarks[foreheadIndices[i + 1]];
    if (a && b) {
      result.push(lerp(a, b, 0.333));
      result.push(lerp(a, b, 0.667));
    }
  }

  // 3. Eyebrows (Left 9 segments x 2 = 18, Right 9 segments x 2 = 18 => 36 points)
  const leftBrow = [46, 53, 52, 65, 55, 70, 63, 105, 66, 107];
  for (let i = 0; i < leftBrow.length - 1; i++) {
    const a = baseMarks[leftBrow[i]];
    const b = baseMarks[leftBrow[i + 1]];
    if (a && b) {
      result.push(lerp(a, b, 0.333));
      result.push(lerp(a, b, 0.667));
    }
  }
  const rightBrow = [276, 283, 282, 295, 285, 300, 293, 334, 296, 336];
  for (let i = 0; i < rightBrow.length - 1; i++) {
    const a = baseMarks[rightBrow[i]];
    const b = baseMarks[rightBrow[i + 1]];
    if (a && b) {
      result.push(lerp(a, b, 0.333));
      result.push(lerp(a, b, 0.667));
    }
  }

  // 4. Periorbital margins (Left eye 16 seg x 2 = 32, Right eye 16 seg x 2 = 32 => 64 points)
  const leftEyeContour = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246, 33];
  for (let i = 0; i < leftEyeContour.length - 1; i++) {
    const a = baseMarks[leftEyeContour[i]];
    const b = baseMarks[leftEyeContour[i + 1]];
    if (a && b) {
      result.push(lerp(a, b, 0.333));
      result.push(lerp(a, b, 0.667));
    }
  }
  const rightEyeContour = [263, 249, 390, 373, 374, 380, 381, 382, 362, 398, 384, 385, 386, 387, 388, 466, 263];
  for (let i = 0; i < rightEyeContour.length - 1; i++) {
    const a = baseMarks[rightEyeContour[i]];
    const b = baseMarks[rightEyeContour[i + 1]];
    if (a && b) {
      result.push(lerp(a, b, 0.333));
      result.push(lerp(a, b, 0.667));
    }
  }

  // 5. Nasal ridge, columella, alar base (24 segments x 2 = 48 points)
  const noseStructure = [
    168, 6, 197, 195, 5, 4, 1, 19, 94, 2, // Dorsum & base
    98, 97, 2, 327, 326, // Columella & bottom
    129, 49, 131, 134, 51, 5, // Left alar
    358, 279, 360, 363, 281 // Right alar
  ];
  for (let i = 0; i < noseStructure.length - 1; i++) {
    const a = baseMarks[noseStructure[i]];
    const b = baseMarks[noseStructure[i + 1]];
    if (a && b) {
      result.push(lerp(a, b, 0.333));
      result.push(lerp(a, b, 0.667));
    }
  }

  // 6. Oral margins / Vermilion border (Outer lips 20 seg x 2 = 40, Inner lips 12 seg x 2 = 24 => 64 points)
  const outerLips = [
    61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, // Lower
    291, 409, 270, 269, 267, 0, 37, 39, 40, 185, 61 // Upper
  ];
  for (let i = 0; i < outerLips.length - 1; i++) {
    const a = baseMarks[outerLips[i]];
    const b = baseMarks[outerLips[i + 1]];
    if (a && b) {
      result.push(lerp(a, b, 0.333));
      result.push(lerp(a, b, 0.667));
    }
  }
  const innerLips = [
    78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, // Lower inner
    308, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78 // Upper inner
  ];
  for (let i = 0; i < innerLips.length - 1; i++) {
    const a = baseMarks[innerLips[i]];
    const b = baseMarks[innerLips[i + 1]];
    if (a && b) {
      result.push(lerp(a, b, 0.333));
      result.push(lerp(a, b, 0.667));
    }
  }

  // 7. Zygomatic arches & nasolabial folds (20 seg x 2 = 40 points)
  const cheeksAndFolds = [
    116, 123, 147, 213, 192, 214, 212, 202, 204, 208, 206, // Left cheek
    345, 352, 376, 433, 416, 434, 432, 422, 424, 428 // Right cheek
  ];
  for (let i = 0; i < cheeksAndFolds.length - 1; i++) {
    const a = baseMarks[cheeksAndFolds[i]];
    const b = baseMarks[cheeksAndFolds[i + 1]];
    if (a && b) {
      result.push(lerp(a, b, 0.333));
      result.push(lerp(a, b, 0.667));
    }
  }

  // 8. Facial triangulation centroids (22 points)
  const centroidTriangles: [number, number, number][] = [
    [10, 67, 109], [10, 297, 338], [168, 107, 336], [168, 66, 296],
    [1, 33, 133], [1, 263, 362], [1, 61, 291], [1, 2, 168],
    [152, 148, 377], [152, 176, 400], [152, 149, 378], [152, 150, 379],
    [116, 123, 234], [345, 352, 454], [50, 101, 205], [280, 330, 425],
    [13, 14, 61], [13, 14, 291], [168, 197, 195], [2, 164, 18],
    [6, 168, 8], [9, 10, 151]
  ];
  for (const [i1, i2, i3] of centroidTriangles) {
    const p1 = baseMarks[i1];
    const p2 = baseMarks[i2];
    const p3 = baseMarks[i3];
    if (p1 && p2 && p3) {
      result.push({
        x: (p1.x + p2.x + p3.x) / 3,
        y: (p1.y + p2.y + p3.y) / 3,
        z: ((p1.z || 0) + (p2.z || 0) + (p3.z || 0)) / 3
      });
    }
  }

  return result;
}

// Test with dummy 478 MediaPipe points
const dummyBase: Point3D[] = [];
for (let i = 0; i < 478; i++) {
  dummyBase.push({ x: 0.5 + (i % 20) * 0.02, y: 0.5 + Math.floor(i / 20) * 0.02, z: 0.01 });
}

const dense = densifyFaceMesh(dummyBase);
console.log('Base count:', dummyBase.length);
console.log('Dense count:', dense.length);

// Helper for 888-point centered vector calculation
function computeDenseFeatures(marks: Point3D[]) {
  const center = marks[1]; // nose tip
  const scale = Math.sqrt((marks[152].x - marks[10].x) ** 2 + (marks[152].y - marks[10].y) ** 2) || 1;
  const rads: number[] = [];
  let sum = 0;
  for (let i = 0; i < marks.length; i++) {
    const dx = (marks[i].x - center.x) / scale;
    const dy = (marks[i].y - center.y) * 1.25 / scale;
    const dz = ((marks[i].z || 0) - (center.z || 0)) / scale;
    const r = Math.sqrt(dx * dx + dy * dy + dz * dz);
    rads.push(r);
    sum += r;
  }
  const mean = sum / marks.length;
  const centered = rads.map(r => r - mean);
  const norm = Math.sqrt(centered.reduce((acc, v) => acc + v * v, 0)) || 1;
  const normalized = centered.map(v => v / norm);
  return { rads, centered, normalized, mean, scale };
}

// Compare two dense mark sets
function compareDenseSets(marksA: Point3D[], marksB: Point3D[]) {
  const featA = computeDenseFeatures(marksA);
  const featB = computeDenseFeatures(marksB);
  
  // Centered cosine similarity
  let dot = 0;
  for (let i = 0; i < featA.normalized.length; i++) {
    dot += featA.normalized[i] * featB.normalized[i];
  }
  
  // Normalized point-to-point displacement RMSE
  let sumSqErr = 0;
  for (let i = 0; i < marksA.length; i++) {
    const d = Math.abs(featA.rads[i] - featB.rads[i]);
    sumSqErr += d * d;
  }
  const rmse = Math.sqrt(sumSqErr / marksA.length);
  return { centeredCosine: dot, rmse };
}

// Test Case 1: Same person with minor noise
const marksSame = dummyBase.map(p => ({
  x: p.x + (Math.random() - 0.5) * 0.003,
  y: p.y + (Math.random() - 0.5) * 0.003,
  z: (p.z || 0) + (Math.random() - 0.5) * 0.002
}));
const denseSameA = densifyFaceMesh(dummyBase);
const denseSameB = densifyFaceMesh(marksSame);
const resSame = compareDenseSets(denseSameA, denseSameB);
console.log('Same Person Centered Cosine:', resSame.centeredCosine.toFixed(4), 'RMSE:', resSame.rmse.toFixed(4));

// Test Case 2: Different person (wider jaw, shorter face, altered proportions)
const marksDiff = dummyBase.map((p, i) => {
  // Alter jaw and cheek landmarks
  const isLower = p.y > 0.6;
  const isOuter = Math.abs(p.x - 0.5) > 0.15;
  return {
    x: p.x + (isOuter ? 0.04 : -0.02),
    y: p.y * (isLower ? 0.92 : 1.05),
    z: (p.z || 0) * 1.5
  };
});
const denseDiff = densifyFaceMesh(marksDiff);
const resDiff = compareDenseSets(denseSameA, denseDiff);
console.log('Different Person Centered Cosine:', resDiff.centeredCosine.toFixed(4), 'RMSE:', resDiff.rmse.toFixed(4));

