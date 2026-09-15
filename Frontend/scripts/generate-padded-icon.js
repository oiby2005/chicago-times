const fs = require('fs');
const jpeg = require('jpeg-js');

// Create 512x512 padded emblem images (white background & dark navy background)
const width = 512;
const height = 512;

// Decode original Fav Icon.jpg
const favIconBuf = fs.readFileSync('public/images/design-reference/Fav Icon.jpg');
const favIcon = jpeg.decode(favIconBuf, { useTolerant: true });

// 1. WHITE BACKGROUND PADDED ICON (Emblem occupies ~55% of the frame with 22.5% padding on all sides)
const whiteFrame = Buffer.alloc(width * height * 4);
for (let i = 0; i < width * height * 4; i += 4) {
  whiteFrame[i] = 255;     // R
  whiteFrame[i + 1] = 255; // G
  whiteFrame[i + 2] = 255; // B
  whiteFrame[i + 3] = 255; // Alpha
}

// Scale factor: emblem scaled to ~280px inside 512px canvas (55% height)
const scaleW = 280 / favIcon.width;
const scaleH = 280 / favIcon.height;
const scale = Math.min(scaleW, scaleH);

const scaledW = Math.round(favIcon.width * scale);
const scaledH = Math.round(favIcon.height * scale);
const startX = Math.round((width - scaledW) / 2);
const startY = Math.round((height - scaledH) / 2);

for (let sy = 0; sy < scaledH; sy++) {
  for (let sx = 0; sx < scaledW; sx++) {
    const srcX = Math.min(favIcon.width - 1, Math.floor(sx / scale));
    const srcY = Math.min(favIcon.height - 1, Math.floor(sy / scale));
    const srcIdx = (srcY * favIcon.width + srcX) * 4;

    const r = favIcon.data[srcIdx];
    const g = favIcon.data[srcIdx + 1];
    const b = favIcon.data[srcIdx + 2];

    const targetX = startX + sx;
    const targetY = startY + sy;

    if (targetX >= 0 && targetX < width && targetY >= 0 && targetY < height) {
      const dstIdx = (targetY * width + targetX) * 4;
      whiteFrame[dstIdx] = r;
      whiteFrame[dstIdx + 1] = g;
      whiteFrame[dstIdx + 2] = b;
      whiteFrame[dstIdx + 3] = 255;
    }
  }
}

// Write white background padded favicon
const encodedWhite = jpeg.encode({ data: whiteFrame, width, height }, 95);
fs.writeFileSync('public/images/design-reference/Fav-Icon-Padded.jpg', encodedWhite.data);
console.log('Created public/images/design-reference/Fav-Icon-Padded.jpg');

// 2. DARK NAVY BACKGROUND PADDED ICON (#0E1838)
const bgR = 14, bgG = 24, bgB = 56;
const fgR = 255, fgG = 255, fgB = 255;
const darkFrame = Buffer.alloc(width * height * 4);

for (let i = 0; i < width * height * 4; i += 4) {
  darkFrame[i] = bgR;
  darkFrame[i + 1] = bgG;
  darkFrame[i + 2] = bgB;
  darkFrame[i + 3] = 255;
}

for (let sy = 0; sy < scaledH; sy++) {
  for (let sx = 0; sx < scaledW; sx++) {
    const srcX = Math.min(favIcon.width - 1, Math.floor(sx / scale));
    const srcY = Math.min(favIcon.height - 1, Math.floor(sy / scale));
    const srcIdx = (srcY * favIcon.width + srcX) * 4;

    const r = favIcon.data[srcIdx];
    const g = favIcon.data[srcIdx + 1];
    const b = favIcon.data[srcIdx + 2];

    const darkness = 1 - ((r + g + b) / 3 / 255);

    if (darkness > 0.15) {
      const targetX = startX + sx;
      const targetY = startY + sy;

      if (targetX >= 0 && targetX < width && targetY >= 0 && targetY < height) {
        const dstIdx = (targetY * width + targetX) * 4;
        const alpha = Math.min(1, darkness * 1.3);
        darkFrame[dstIdx] = Math.round(bgR * (1 - alpha) + fgR * alpha);
        darkFrame[dstIdx + 1] = Math.round(bgG * (1 - alpha) + fgG * alpha);
        darkFrame[dstIdx + 2] = Math.round(bgB * (1 - alpha) + fgB * alpha);
      }
    }
  }
}

const encodedDark = jpeg.encode({ data: darkFrame, width, height }, 95);
fs.writeFileSync('public/images/design-reference/Fav-Icon-Dark-Padded.jpg', encodedDark.data);
console.log('Created public/images/design-reference/Fav-Icon-Dark-Padded.jpg');
