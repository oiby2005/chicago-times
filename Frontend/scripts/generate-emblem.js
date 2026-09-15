const fs = require('fs');
const jpeg = require('jpeg-js');

// 512x512 resolution for high-DPI link preview cards
const width = 512;
const height = 512;
const frameData = Buffer.alloc(width * height * 4);

// Background color: Dark Navy #0E1838 (RGB: 14, 24, 56)
const bgR = 14, bgG = 24, bgB = 56;
// Emblem color: Pure White #FFFFFF (RGB: 255, 255, 255)
const fgR = 255, fgG = 255, fgB = 255;

// Fill background
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    frameData[idx] = bgR;
    frameData[idx + 1] = bgG;
    frameData[idx + 2] = bgB;
    frameData[idx + 3] = 255;
  }
}

// Decode Fav Icon.jpg (88x87) to overlay the "C" emblem cleanly in the center
const favIconBuf = fs.readFileSync('public/images/design-reference/Fav Icon.jpg');
const favIcon = jpeg.decode(favIconBuf, { useTolerant: true });

// Center 88x87 image scaled 3.5x to ~308x305 in the middle of 512x512
const scale = 3.5;
const scaledW = Math.round(favIcon.width * scale);
const scaledH = Math.round(favIcon.height * scale);
const startX = Math.round((width - scaledW) / 2);
const startY = Math.round((height - scaledH) / 2);

for (let sy = 0; sy < scaledH; sy++) {
  for (let sx = 0; sx < scaledW; sx++) {
    const srcX = Math.min(favIcon.width - 1, Math.floor(sx / scale));
    const srcY = Math.min(favIcon.height - 1, Math.floor(sy / scale));
    const srcIdx = (srcY * favIcon.width + srcX) * 4;

    const sr = favIcon.data[srcIdx];
    const sg = favIcon.data[srcIdx + 1];
    const sb = favIcon.data[srcIdx + 2];

    // Check if pixel is part of the emblem (dark pixel in original black/white icon)
    // Dark pixels (sr < 200) become white fgR, fgG, fgB
    const darkness = 1 - ((sr + sg + sb) / 3 / 255);

    if (darkness > 0.15) {
      const targetX = startX + sx;
      const targetY = startY + sy;

      if (targetX >= 0 && targetX < width && targetY >= 0 && targetY < height) {
        const dstIdx = (targetY * width + targetX) * 4;
        // Blend white emblem over dark navy background
        const alpha = Math.min(1, darkness * 1.3);
        frameData[dstIdx] = Math.round(bgR * (1 - alpha) + fgR * alpha);
        frameData[dstIdx + 1] = Math.round(bgG * (1 - alpha) + fgG * alpha);
        frameData[dstIdx + 2] = Math.round(bgB * (1 - alpha) + fgB * alpha);
      }
    }
  }
}

// Encode to JPEG
const rawImageData = {
  data: frameData,
  width: width,
  height: height,
};
const jpegImageData = jpeg.encode(rawImageData, 95);
fs.writeFileSync('public/images/design-reference/square-emblem-dark.jpg', jpegImageData.data);
console.log('Successfully created public/images/design-reference/square-emblem-dark.jpg');
