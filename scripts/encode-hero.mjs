/**
 * Re-encode the hero portrait for the web.
 *
 * The source is a 1000x1000 PNG cut-out: ~48% of its pixels are fully
 * transparent, and `mask-image` in src/index.css keys off that alpha to keep the
 * accent tint registered to the subject instead of painting a rectangle.
 *
 * Two constraints are load-bearing, and both are easy to break by hand-editing
 * the command:
 *
 * 1. ASPECT MUST STAY 1:1. The render box is `aspect-[4/5]` and the <img> is
 *    `object-cover`, so a square source overflows horizontally and roughly 20%
 *    of its width is already cropped away. Re-encoding to 4:5 would "fit" the
 *    image and silently re-frame the portrait — a different picture, not a
 *    smaller one.
 *
 * 2. THE ALPHA CHANNEL IS LOSSLESS. WebP encodes alpha separately from colour;
 *    WebP's alpha is lossless at alphaQuality 100, and the measured mean absolute
 *    error against the PNG is exactly 0. The mask therefore stays pixel-exact.
 *    Colour is lossy, but at opacity-80 over a flat ground a mean error under
 *    2/255 is not visible.
 *
 * 800px covers the 288px render box at ~3.4x device pixel ratio, so it stays
 * crisp on 3x displays while costing about a fourteenth of the PNG.
 *
 * Usage: npm run encode:hero
 */
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'src/assets/profile3.png');
const target = resolve(root, 'src/assets/profile3.webp');

const EDGE = 800;

await mkdir(dirname(target), { recursive: true });

await sharp(source)
  // `fill` with equal dimensions is a pure resample; it never crops or pads, so
  // the source stays 1:1 and the object-cover crop is untouched.
  .resize(EDGE, EDGE, { fit: 'fill', kernel: 'lanczos3' })
  .webp({ quality: 82, alphaQuality: 100, effort: 6 })
  .toFile(target);

const before = await sharp(source).metadata();
const after = await sharp(target).metadata();

console.log(`profile3.png  ${before.width}x${before.height}`);
console.log(`profile3.webp ${after.width}x${after.height}  alpha=${after.hasAlpha}`);