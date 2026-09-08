/**
 * Image Rotation & Preprocessing Service
 * Rotates images 90 degrees clockwise / counter-clockwise on canvas.
 * Essential for ID cards and phone photos captured in vertical/sideways orientations.
 */

export async function rotateImageDataUri(
  imageSource: string,
  degrees: 90 | 180 | 270 | -90
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas 2D context unavailable'));

        const rads = (degrees * Math.PI) / 180;
        const isSwapDim = Math.abs(degrees) === 90 || Math.abs(degrees) === 270;

        const w = isSwapDim ? img.height : img.width;
        const h = isSwapDim ? img.width : img.height;

        canvas.width = w;
        canvas.height = h;

        // Move to center, rotate, and draw
        ctx.translate(w / 2, h / 2);
        ctx.rotate(rads);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        resolve(canvas.toDataURL('image/jpeg', 0.95));
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image for rotation'));
    img.src = imageSource;
  });
}
