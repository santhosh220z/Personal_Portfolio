/**
 * Generate the social share card: public/og.png, 1200x630.
 *
 * Why this is a script and not a hand-made asset: the card has to stay in step
 * with the design tokens. Every colour below is lifted from src/index.css, so a
 * token change is a one-line edit here rather than a redraw in a design tool
 * that nobody opens again.
 *
 * COLOUR WARNING — the README's token table is stale. It lists the acid lime
 * --accent (#E2F952); the stylesheet now runs vermilion (#e34a3a) and keeps the
 * lime only inside a ROLLBACK comment. This card uses what the stylesheet
 * actually does. If you roll the accent back, update ACCENT here too.
 *
 * Rendering uses headless Chrome rather than sharp/librsvg, because librsvg
 * silently ignores @font-face and falls back to a system face — the card would
 * ship set in the wrong typeface and look almost right, which is worse than
 * looking broken. Chrome loads the real Syne/Geist Mono woff2 files. (Verified:
 * an embedded-font render differs from a nonexistent-family render by ~58k
 * pixels; under librsvg the difference was 0.)
 *
 * The PNG is a committed asset, so this script is not part of `npm run build`
 * and Chrome is not a dependency of the build. Run it only when the card or the
 * tokens change:
 *
 *   npm run og
 *
 * Chrome cannot write into this OneDrive folder (access denied), so it
 * screenshots into the OS temp dir and sharp copies the result into public/.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { findChrome, HEADLESS_ARGS } from './chrome.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// From src/index.css [data-theme='dark']. Dark is the primary art direction, so
// the card is dark-only: a light card would misrepresent the site on every share.
const CANVAS = '#0b0b0c';
const SURFACE = '#131315';
const FG_1 = '#f4f4f5';
const FG_2 = '#a1a1aa';
const FG_3 = '#71717a';
const RULE = 'rgba(255,255,255,0.10)';
const ACCENT = '#e34a3a';
const STATUS = '#4ade80';

const NAME = 'Santhosh Sunkara';
const ROLE = 'Applied ML Engineer';
const LINE = 'Vision and language systems that survive production.';
const STATUS_TEXT = 'Available for roles';

const syne = 'file:///' + join(ROOT, 'node_modules/@fontsource-variable/syne/files/syne-latin-wght-normal.woff2').replace(/\\/g, '/');
const mono = 'file:///' + join(ROOT, 'node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2').replace(/\\/g, '/');
const portrait = 'file:///' + join(ROOT, 'src/assets/profile3.webp').replace(/\\/g, '/');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Syne';src:url('${syne}') format('woff2-variations');font-weight:400 800}
  @font-face{font-family:'GeistMono';src:url('${mono}') format('woff2-variations');font-weight:100 900}
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1200px;height:630px;overflow:hidden}
  body{
    background:${CANVAS};color:${FG_1};font-family:'Syne',sans-serif;
    display:flex;flex-direction:column;justify-content:space-between;
    padding:64px 72px;position:relative;
  }
  /* Faint node/edge field: the ML-diagram vocabulary, at the edge of visibility. */
  .field{position:absolute;inset:0;opacity:.5}
  .top{display:flex;align-items:center;gap:14px;font-family:'GeistMono',monospace;
       font-size:15px;letter-spacing:.16em;text-transform:uppercase;color:${FG_2}}
  .dot{width:9px;height:9px;border-radius:50%;background:${STATUS}}
  .rule{height:1px;background:${RULE}}
  .mid{flex:1;display:flex;align-items:center;gap:48px}
  .copy{flex:1;min-width:0}
  .role{font-family:'GeistMono',monospace;font-size:17px;letter-spacing:.18em;
        text-transform:uppercase;color:${ACCENT};margin-bottom:22px}
  h1{font-size:88px;font-weight:600;line-height:.98;letter-spacing:-.025em}
  .underline{display:block;width:132px;height:5px;background:${ACCENT};margin:28px 0 24px}
  .line{font-size:25px;line-height:1.45;color:${FG_2};max-width:19ch;font-weight:400}
  .mark{width:400px;height:400px;position:relative;flex:none}
  /* No mask-image here, deliberately. The portrait is already a cut-out with a
     real alpha channel (about 48% of its pixels are transparent), so masking it
     by its own alpha is redundant — and in headless Chrome a mask-image
     pointing at a file:// URL renders as nothing at all, which silently
     produced an empty right-hand column. object-fit does the cropping. */
  .mark img{width:100%;height:100%;object-fit:contain;
            filter:grayscale(1) contrast(1.06) brightness(1.04)}
  .foot{display:flex;align-items:center;justify-content:space-between;
        font-family:'GeistMono',monospace;font-size:15px;letter-spacing:.13em;
        text-transform:uppercase;color:${FG_3}}
  .foot b{color:${FG_2};font-weight:500}
</style></head>
<body>
  <svg class="field" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <g stroke="${RULE}" stroke-width="1" fill="none">
      ${Array.from({ length: 13 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="630"/>`).join('')}
      ${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${i * 90}" x2="1200" y2="${i * 90}"/>`).join('')}
    </g>
  </svg>

  <div class="top"><span class="dot"></span><span>${STATUS_TEXT}</span></div>
  <div class="rule"></div>

  <div class="mid">
    <div class="copy">
      <p class="role">${ROLE}</p>
      <h1>${NAME}</h1>
      <span class="underline"></span>
      <p class="line">${LINE}</p>
    </div>
    <div class="mark"><img src="${portrait}" alt=""></div>
  </div>

  <div class="rule"></div>
  <div class="foot"><span>santhosh_sunkara_portifolio.com</span><span><b>github</b> /santhosh220z</span></div>
</body></html>`;

const chrome = findChrome();

if (!chrome) {
  console.error(
    'No Chrome, Chromium or Edge found. Install one, set CHROME_PATH, or\n' +
    'hand-draw public/og.png — it is a committed asset, not a build input.',
  );
  process.exit(1);
}

const dir = mkdtempSync(join(tmpdir(), 'og-'));
const htmlPath = join(dir, 'card.html');
const shotPath = join(dir, 'card.png');
writeFileSync(htmlPath, html);

execFileSync(
  chrome,
  [
    ...HEADLESS_ARGS,
    `--screenshot=${shotPath}`,
    '--window-size=1200,630',
    // Let the webfonts decode before the shot, or the card captures a fallback.
    '--virtual-time-budget=5000',
    `file:///${htmlPath.replace(/\\/g, '/')}`,
  ],
  { stdio: 'ignore' },
);

const out = resolve(ROOT, 'public/og.png');
await sharp(readFileSync(shotPath))
  .png({ compressionLevel: 9, quality: 92 })
  .toFile(out);

const meta = await sharp(out).metadata();
console.log(`public/og.png  ${meta.width}x${meta.height}`);