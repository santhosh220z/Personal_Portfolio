/**
 * Screenshot the hero at a few widths so a layout change can be judged by eye
 * rather than by whether the build passed.
 *
 * Usage: node scripts/shoot-hero.mjs http://localhost:4173 [outDir]
 *
 * Pass `--full` to also capture the whole document at desktop width, which is
 * the fastest way to review every section at once instead of screenshotting
 * them one scroll at a time.
 *
 * Pass `--at <id>` to capture one element by id instead — the way to look
 * closely at a single section without scrolling a viewport-sized window to it.
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { findChrome, HEADLESS_ARGS } from './chrome.mjs';

const BASE = process.argv[2] ?? 'http://localhost:4173';
const args = process.argv.slice(3);
const FULL = args.includes('--full');
const AT = args.includes('--at') ? args[args.indexOf('--at') + 1] : null;
const OUT = resolve(args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--at') ?? join(process.env.TEMP ?? tmpdir(), 'hero-shots'));
const CHROME = findChrome();

if (!CHROME) {
  console.error('No Chrome/Chromium/Edge found. Set CHROME_PATH.');
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

const WIDTHS = [
  { w: 1920, h: 950, name: 'wide-1920' },
  { w: 1440, h: 900, name: 'desktop-1440' },
  { w: 1280, h: 800, name: 'desktop-1280' },
  { w: 834, h: 1000, name: 'tablet-834' },
  { w: 390, h: 844, name: 'mobile-390' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// One browser, N viewports.
//
// This originally launched a fresh headless Chrome per width, and each cold
// start paid profile creation, font-cache rebuild and first-paint — about 40s
// per screenshot, which is four minutes of apparently-hung terminal. Reusing a
// single process and resizing its window instead takes the whole set to a few
// seconds.
//
// The per-shot profile directories were also unused: --screenshot does not need
// --user-data-dir, so they were created and deleted for nothing.
const profile = mkdtempSync(join(tmpdir(), 'shoot-'));
const port = 9700 + Math.floor(Math.random() * 200);
const chrome = spawn(CHROME, [
  ...HEADLESS_ARGS,
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  '--window-size=1440,900',
  'about:blank',
], { stdio: 'ignore' });

let ws, nextId = 1;
const pending = new Map();
const send = (method, params = {}) => {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((res, rej) => pending.set(id, { res, rej }));
};

try {
  let target = null;
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/list`);
      const list = await r.json();
      const page = list.find((t) => t.type === 'page');
      if (page?.webSocketDebuggerUrl) { target = page.webSocketDebuggerUrl; break; }
    } catch {}
    await sleep(150);
  }
  if (!target) throw new Error('Chrome did not expose a CDP endpoint');

  ws = new WebSocket(target);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      const { res, rej } = pending.get(m.id);
      pending.delete(m.id);
      m.error ? rej(new Error(m.error.message)) : res(m.result);
    }
  };

  await send('Page.enable');

  for (const { w, h, name } of WIDTHS) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: w, height: h, deviceScaleFactor: 1, mobile: w < 768,
    });
    await send('Page.navigate', { url: BASE });
    await sleep(2200); // let fonts decode and the entrance timeline finish

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(OUT, `${name}.png`), Buffer.from(shot.data, 'base64'));
    console.log(`  ${name}  ${w}x${h}`);
  }

  // Single element by id. Clipped to its box so the capture is the section and
  // not whatever happens to share the viewport with it.
  if (AT) {
    // Reset to desktop first: the width loop above leaves the last viewport
    // override in place, so without this a section is measured at whatever the
    // final width was — an `about` section reported 390px wide when asked for
    // at a 1440px desktop.
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
    });
    await send('Page.navigate', { url: BASE });
    await sleep(2200);
    // The target may be a whileInView reveal, so walk down to it before
    // measuring — otherwise it is captured at opacity 0.
    await send('Runtime.evaluate', {
      expression: `document.getElementById(${JSON.stringify(AT)})?.scrollIntoView({block:'center'})`,
    });
    await sleep(1400);

    // Centre-scrolling is not enough when the target is TALLER than the
    // viewport: `--at work` centres a 2239px section in a 900px window, so its
    // lower half never enters the viewport and every whileInView reveal down
    // there is still at opacity 0 when the capture happens. The result is a
    // screenshot with empty boxes where content should be — which reads as a
    // layout bug and is not one. So step down through the element's own height
    // before measuring, exactly as the --full pass below does for the document.
    //
    // Each scroll has to be its own CDP round-trip with a settle in between.
    // Doing it as a synchronous `for` loop inside one Runtime.evaluate looks
    // equivalent and is not: the browser never paints the intermediate
    // positions, so IntersectionObserver only ever sees the final offset and
    // the reveals still do not fire.
    const span = await send('Runtime.evaluate', {
      expression: `(() => { const el = document.getElementById(${JSON.stringify(AT)});
        if (!el) return null; const r = el.getBoundingClientRect();
        return JSON.stringify({ top: r.top + scrollY, height: r.height }); })()`,
      returnByValue: true,
    });
    if (span.result.value) {
      const { top, height } = JSON.parse(span.result.value);
      for (let y = top; y < top + height; y += 600) {
        await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
        await sleep(120);
      }
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${top})` });
      await sleep(700);
    }

    const box = await send('Runtime.evaluate', {
      expression: `(() => { const el = document.getElementById(${JSON.stringify(AT)});
        if (!el) return null; const r = el.getBoundingClientRect();
        return JSON.stringify({ x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height }); })()`,
      returnByValue: true,
    });
    if (!box.result.value) {
      console.error(`  --at ${AT}: no element with that id`);
      process.exitCode = 1;
    } else {
      const b = JSON.parse(box.result.value);
      const pad = 24;
      const shot = await send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: true,
        clip: {
          x: Math.max(0, b.x - pad), y: Math.max(0, b.y - pad),
          width: b.width + pad * 2, height: b.height + pad * 2, scale: 1,
        },
      });
      writeFileSync(join(OUT, `at-${AT}.png`), Buffer.from(shot.data, 'base64'));
      console.log(`  at-${AT}  ${Math.round(b.width)}x${Math.round(b.height)}`);
    }
  }

  // Full document, at desktop width. captureBeyondViewport covers content below
  // the fold without resizing, so the layout is not reflowed by a 900px-tall
  // window the way a giant --window-size would reflow it.
  if (FULL) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
    });
    await send('Page.navigate', { url: BASE });
    await sleep(2500);
    // Walk the page so every whileInView reveal has fired before capture.
    const height = await send('Runtime.evaluate', {
      expression: 'document.documentElement.scrollHeight', returnByValue: true,
    });
    for (let y = 0; y < height.result.value; y += 700) {
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
      await sleep(120);
    }
    await sleep(1200);
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0,0)' });
    await sleep(500);
    const shot = await send('Page.captureScreenshot', {
      format: 'png', captureBeyondViewport: true,
    });
    writeFileSync(join(OUT, 'full-page.png'), Buffer.from(shot.data, 'base64'));
    console.log(`  full-page  ${height.result.value}px tall`);
  }
} catch (e) {
  console.error(`  harness failed: ${e.message}`);
  process.exitCode = 1;
} finally {
  try { ws?.close(); } catch {}
  chrome.kill();
  await sleep(200);
  rmSync(profile, { recursive: true, force: true });
}

console.log(`\n-> ${OUT}`);