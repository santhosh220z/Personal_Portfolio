/**
 * Headless browser check against the built site.
 *
 * `npm run build` succeeding only proves the code compiles. It says nothing
 * about whether React mounts, whether the deferred palette/drawer chunks are
 * genuinely deferred, or whether anything throws on load. This drives a real
 * Chrome over the DevTools Protocol and asserts the things a build cannot.
 *
 * No dependencies: Node 22+ ships a global WebSocket and Chrome exposes CDP over
 * one, so the client here is ~40 lines instead of pulling in Puppeteer.
 *
 * Usage: node .tmp-browsercheck.mjs http://localhost:4319
 *
 * NOTE ON THREE OF THESE ASSERTIONS. An earlier version of this file reported
 * false failures that were the test's fault, not the app's:
 *
 *   1. "nothing stuck at opacity 0" — `whileInView` legitimately hides content
 *      below the fold until it is scrolled to. Scanning the whole document
 *      without scrolling flags 48 correct elements. This version scrolls the
 *      page the way a person does, then asserts.
 *   2. Escape-to-close — dispatching a synthetic KeyboardEvent on `window` does
 *      not reach the dialog's capture-phase listener reliably. This version uses
 *      CDP Input.dispatchKeyEvent, which is a genuine keypress.
 *   3. "lazy chunks must not load initially" — correct in principle, but it only
 *      means something if nothing else preloads them. This version asserts on
 *      the actual request timeline relative to the hero image.
 */
const BASE = process.argv[2] ?? 'http://localhost:4319';
const { spawn } = await import('node:child_process');
const { mkdtempSync, rmSync } = await import('node:fs');
const { tmpdir } = await import('node:os');
const { join } = await import('node:path');
const { findChrome, HEADLESS_ARGS } = await import('./chrome.mjs');

const CHROME = findChrome();
if (!CHROME) {
  // Fail with an actionable message rather than the bare ENOENT that a hardcoded
  // path produced. This is what the CI workflow hit on its first run.
  console.error(
    'No Chrome, Chromium or Edge binary found.\n' +
    'Looked in the usual locations for macOS, Linux and Windows.\n' +
    'Set CHROME_PATH to override, e.g. CHROME_PATH=/usr/bin/chromium npm run verify:site',
  );
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const record = (name, ok, detail = '') => {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  -> ' + detail : ''}`);
};

const profile = mkdtempSync(join(tmpdir(), 'cdp-'));
const port = 9222 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, [
    ...HEADLESS_ARGS,
    '--window-size=1280,900', `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`, 'about:blank',
  ], { stdio: 'ignore' });

let ws, nextId = 1;
const pending = new Map();
const listeners = [];
const requests = [];

const send = (method, params = {}) => {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
};

async function connect() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const targets = await res.json();
      const page = targets.find((t) => t.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch { /* not up yet */ }
    await sleep(250);
  }
  throw new Error('Chrome did not expose a CDP endpoint');
}

/**
 * Elements holding real text but sitting at opacity ~0.
 *
 * Defined as a named function at module scope, not an IIFE inside a template
 * literal — those are easy to mis-bracket and produce a confusing SyntaxError
 * at the eval site — and not inside the first `try`, because the reduced-motion
 * pass below needs to reuse it in a separate browser session.
 *
 * Ignores `aria-hidden` subtrees (decorative motifs are meant to be invisible
 * to assistive tech and are opacity-styled on purpose) and zero-size boxes
 * (display:none, never rendered).
 */
function scanHidden() {
  const out = [];
  const all = document.querySelectorAll('main *, footer *, header *');
  for (let i = 0; i < all.length; i++) {
    const el = all[i];
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (el.closest('[aria-hidden="true"]')) continue;
    if (parseFloat(cs.opacity) >= 0.05) continue;
    if (cs.visibility === 'hidden') continue;
    if (el.textContent.trim().length <= 3) continue;
    out.push({ tag: el.tagName, cls: String(el.className).slice(0, 40),
               txt: el.textContent.trim().slice(0, 34) });
  }
  return out;
}

try {
  ws = new WebSocket(await connect());
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    } else if (msg.method) listeners.forEach((fn) => fn(msg));
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');
  await send('Network.enable');

  const consoleErrors = [];
  const pageExceptions = [];
  const failedRequests = [];

  listeners.push((msg) => {
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      consoleErrors.push(msg.params.args.map((a) => a.value ?? a.description ?? '?').join(' '));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      const d = msg.params.exceptionDetails;
      pageExceptions.push(d.exception?.description ?? d.text);
    }
    if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
      consoleErrors.push(msg.params.entry.text + ' ' + (msg.params.entry.url ?? ''));
    }
    if (msg.method === 'Network.loadingFailed') {
      failedRequests.push(`${msg.params.type} ${msg.params.errorText}`);
    }
    if (msg.method === 'Network.requestWillBeSent') {
      const url = msg.params.request.url;
      requests.push({ url: url.split('/').pop(), t: msg.params.timestamp, raw: url });
    }
  });

  const evalJs = async (expression) => {
    const r = await send('Runtime.evaluate', {
      expression, returnByValue: true, awaitPromise: true,
    });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? 'eval failed');
    return r.result.value;
  };

  // Real key presses. A synthetic window-level KeyboardEvent does not reliably
  // reach the dialog's capture-phase listener, which produced a false failure.
  const press = async (key, code, mods = 0, vk = 0) => {
    await send('Input.dispatchKeyEvent', {
      type: 'keyDown', key, code, modifiers: mods,
      windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk,
    });
    await send('Input.dispatchKeyEvent', {
      type: 'keyUp', key, code, modifiers: mods,
      windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk,
    });
  };

  // --- load ----------------------------------------------------------------
  await send('Page.navigate', { url: BASE });
  await sleep(4500);

  const mounted = await evalJs(`(() => ({
    children: document.getElementById('root')?.children.length ?? 0,
    h1: (document.querySelector('h1')?.textContent || '').trim().slice(0, 40),
    sections: [...document.querySelectorAll('main > section')].map(s => s.id),
    theme: document.documentElement.getAttribute('data-theme'),
    navLinks: document.querySelectorAll('nav a').length,
  }))()`);

  record('React mounted (root has children)', mounted.children > 0, `${mounted.children} child node(s)`);
  record('hero <h1> rendered', mounted.h1.length > 0, `"${mounted.h1}"`);
  record('all 8 sections present', mounted.sections.length === 8, mounted.sections.join(','));
  record('theme resolved before paint', ['dark', 'light'].includes(mounted.theme), `data-theme=${mounted.theme}`);
  record('nav links rendered', mounted.navLinks > 0, `${mounted.navLinks} links`);

  // --- hero image ----------------------------------------------------------
  const img = await evalJs(`(() => {
    const i = document.querySelector('main img');
    if (!i) return { found: false };
    return { found: true, src: i.currentSrc.split('/').pop(), w: i.naturalWidth, alt: !!i.alt };
  })()`);
  record('hero portrait loaded', img.found && img.w > 0, img.found ? `${img.src} ${img.w}px wide` : 'no img');
  record('hero portrait is the WebP', (img.src ?? '').endsWith('.webp'), img.src);
  record('hero portrait has alt text', img.alt === true);

  // --- fonts ---------------------------------------------------------------
  const fonts = await evalJs(`(() => ({
    syne: document.fonts.check('700 40px "Syne Variable"'),
    mono: document.fonts.check('400 14px "Geist Mono Variable"'),
  }))()`);
  record('Syne Variable loaded', fonts.syne === true);
  record('Geist Mono Variable loaded', fonts.mono === true);

  // --- LAZY CHUNK DEFERRAL (the real assertion) ---------------------------
  const t0 = requests.length ? requests[0].t : 0;
  const at = (needle) => {
    const hit = requests.find((r) => r.url.includes(needle));
    return hit ? Math.round((hit.t - t0) * 1000) : null;
  };
  const heroAt = at('profile3');
  const paletteAt = at('CommandPalette');
  const drawerAt = at('BlueprintDrawer');

  record('no modulepreload for lazy chunks',
    !(await evalJs(`[...document.querySelectorAll('link[rel="modulepreload"]')].some(e => /CommandPalette|BlueprintDrawer/.test(e.href))`)));

  record('palette chunk NOT fetched during initial load', paletteAt === null,
    paletteAt === null ? 'deferred' : `fetched at ${paletteAt}ms`);
  record('drawer chunk NOT fetched during initial load', drawerAt === null,
    drawerAt === null ? 'deferred' : `fetched at ${drawerAt}ms`);

  // Ordering, not a wall-clock budget. An earlier version asserted "hero loads
  // within 400ms", which passed on `vite preview` (183ms) and came within 50ms
  // of failing on a plain static server (349ms) — a threshold that measures the
  // speed of whatever server is in front of it, not the thing being tested.
  // What actually matters is that the hero wins the connection queue: the lazy
  // chunks must not have been requested ahead of it.
  record('hero image is requested before any lazy chunk',
    heroAt !== null && paletteAt === null && drawerAt === null,
    heroAt === null ? 'hero never requested' : `hero at ${heroAt}ms, no lazy chunk competing`);

  // --- scroll reveal resolves ---------------------------------------------
  const beforeScroll = (await evalJs(`(${scanHidden})()`)).length;
  const docHeight = await evalJs('document.documentElement.scrollHeight');
  for (let y = 0; y < docHeight; y += 400) {
    await evalJs(`window.scrollTo(0, ${y})`);
    await sleep(110);
  }
  await sleep(2000);
  const afterScroll = await evalJs(`(${scanHidden})()`);
  record('scroll-reveal resolves (nothing left hidden after a full scroll)',
    afterScroll.length === 0,
    afterScroll.length ? afterScroll.slice(0, 3).map((e) => `${e.tag}.${e.cls}`).join(',') : `${beforeScroll} hidden -> 0`);

  await evalJs('window.scrollTo(0,0)');
  await sleep(500);

  // --- LAZY CHUNK 1: command palette --------------------------------------
  await press('k', 'KeyK', 2, 75); // 2 = Ctrl
  await sleep(1400);
  const palette = await evalJs(`(() => {
    const d = document.querySelector('[role="dialog"][aria-label="Command palette"]');
    if (!d) return { open: false };
    return { open: true, modal: d.getAttribute('aria-modal'),
             focused: document.activeElement?.tagName,
             listbox: !!d.querySelector('[role="listbox"]'),
             options: d.querySelectorAll('[role="option"]').length };
  })()`);
  record('palette chunk fetched on first open', at('CommandPalette') !== null,
    at('CommandPalette') === null ? 'never fetched' : `${at('CommandPalette')}ms`);
  record('command palette opened via real Ctrl+K', palette.open === true);
  record('palette is a modal dialog', palette.modal === 'true');
  record('palette implements combobox listbox', palette.listbox === true, `${palette.options} options`);
  record('palette moved focus into itself', palette.focused === 'INPUT', `focus on <${palette.focused}>`);

  await press('Escape', 'Escape', 0, 27);
  await sleep(1000);
  record('palette closes on real Escape',
    await evalJs(`!document.querySelector('[role="dialog"][aria-label="Command palette"]')`));

  // Reopen: the chunk must be cached, so no second network request.
  const paletteReqsBefore = requests.filter((r) => r.url.includes('CommandPalette')).length;
  await press('k', 'KeyK', 2, 75);
  await sleep(1000);
  const paletteReqsAfter = requests.filter((r) => r.url.includes('CommandPalette')).length;
  record('palette reopens without refetching (chunk cached)',
    paletteReqsAfter === paletteReqsBefore, `${paletteReqsBefore} request(s) total`);
  await press('Escape', 'Escape', 0, 27);
  await sleep(900);

  // --- LAZY CHUNK 2: blueprint drawer -------------------------------------
  const clicked = await evalJs(`(() => {
    const row = document.querySelector('#work a[href^="#work-"]');
    if (!row) return { found: false };
    row.click();
    return { found: true, href: row.getAttribute('href') };
  })()`);
  await sleep(1600);
  const drawer = await evalJs(`(() => {
    const d = document.querySelector('[role="dialog"][aria-label*="technical blueprint"]');
    if (!d) return { open: false };
    return { open: true, modal: d.getAttribute('aria-modal'), id: d.id };
  })()`);
  record('clicked a work row', clicked.found === true, clicked.href ?? '');
  record('drawer chunk fetched on first open', at('BlueprintDrawer') !== null);
  record('blueprint drawer opened', drawer.open === true);
  record('drawer is a modal dialog', drawer.modal === 'true');

  await press('Escape', 'Escape', 0, 27);
  await sleep(1100);
  record('drawer closes on real Escape',
    await evalJs(`!document.querySelector('[role="dialog"][aria-label*="technical blueprint"]')`));
  record('body scroll unlocked after close',
    await evalJs(`document.body.style.overflow !== 'hidden'`));

  // --- errors --------------------------------------------------------------
  record('no uncaught page exceptions', pageExceptions.length === 0, pageExceptions.slice(0, 2).join(' | ') || 'none');
  record('no console errors', consoleErrors.length === 0, consoleErrors.slice(0, 2).join(' | ') || 'none');
  const realFailures = failedRequests.filter((f) => !/favicon/.test(f));
  record('no failed network requests', realFailures.length === 0, realFailures.slice(0, 2).join(' | ') || 'none');

  // --- screenshot ----------------------------------------------------------
  await evalJs('window.scrollTo(0,0)');
  await sleep(600);
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const { writeFileSync } = await import('node:fs');
  const outPath = join(process.env.TEMP ?? tmpdir(), 'portfolio-hero.png');
  writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
  console.log(`\nscreenshot -> ${outPath}`);

} catch (e) {
  record('harness completed without throwing', false, e.message);
} finally {
  try { ws?.close(); } catch {}
  chrome.kill();
  await sleep(300);
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}

/* ---------------------------------------------------------------------------
   Reduced-motion invariant — a second, independent session.
   ---------------------------------------------------------------------------
   Quoted from src/components/kinetic/ScrubHeadline.jsx:

     "Reduced motion drops movement, not legibility... Nothing here may leave
      an element at opacity 0."

   This cannot be asserted in jsdom: there is no layout engine and no
   IntersectionObserver, so a computed opacity there is not the real thing. It
   needs a real browser and a real scroll.

   A separate session rather than a toggle on the existing one, because
   Emulation.setEmulatedMedia has to be set before the page loads for the hooks
   that read matchMedia on mount to see the right value.
   --------------------------------------------------------------------------- */
async function checkReducedMotion() {
  const profile2 = mkdtempSync(join(tmpdir(), 'cdp-rm-'));
  const port2 = 9600 + Math.floor(Math.random() * 300);
  const ch2 = spawn(CHROME, [
    ...HEADLESS_ARGS,
    '--window-size=1280,900', `--remote-debugging-port=${port2}`,
    `--user-data-dir=${profile2}`, 'about:blank',
  ], { stdio: 'ignore' });

  let ws2, id2 = 1;
  const pend2 = new Map();
  const send2 = (method, params = {}) => {
    const id = id2++;
    ws2.send(JSON.stringify({ id, method, params }));
    return new Promise((res, rej) => pend2.set(id, { res, rej }));
  };

  try {
    let url = null;
    for (let i = 0; i < 60; i++) {
      try {
        const r = await fetch(`http://127.0.0.1:${port2}/json/list`);
        const t = await r.json();
        const p = t.find((x) => x.type === 'page');
        if (p?.webSocketDebuggerUrl) { url = p.webSocketDebuggerUrl; break; }
      } catch {}
      await sleep(250);
    }
    if (!url) throw new Error('second Chrome did not expose a CDP endpoint');

    ws2 = new WebSocket(url);
    await new Promise((res, rej) => { ws2.onopen = res; ws2.onerror = rej; });
    ws2.onmessage = (e) => {
      const m = JSON.parse(e.data);
      if (m.id && pend2.has(m.id)) {
        const { res, rej } = pend2.get(m.id);
        pend2.delete(m.id);
        m.error ? rej(new Error(m.error.message)) : res(m.result);
      }
    };

    await send2('Page.enable');
    await send2('Runtime.enable');
    await send2('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
    });

    const eval2 = async (expression) => {
      const r = await send2('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? 'eval failed');
      return r.result.value;
    };

    await send2('Page.navigate', { url: BASE });
    await sleep(4500);

    record('reduced-motion: the media query is actually emulated',
      (await eval2(`matchMedia('(prefers-reduced-motion: reduce)').matches`)) === true);

    const h1 = await eval2(`parseFloat(getComputedStyle(document.querySelector('h1')).opacity)`);
    record('reduced-motion: h1 fully opaque immediately (no fade-in)', h1 > 0.95, `opacity=${h1}`);

    // Scroll the whole document in small steps so every element genuinely
    // crosses the viewport and its IntersectionObserver fires. Jumping straight
    // to an anchor skips everything in between, which is what made an earlier
    // version of this check report 48 false failures.
    const docHeight = await eval2('document.documentElement.scrollHeight');
    for (let y = 0; y < docHeight; y += 400) {
      await eval2(`window.scrollTo(0, ${y})`);
      await sleep(120);
    }
    await sleep(2500);

    const stuck = await eval2(`(${scanHidden.toString()})()`);
    record('reduced-motion: NOTHING left at opacity ~0 after a full scroll',
      stuck.length === 0,
      stuck.length ? stuck.slice(0, 3).map((e) => `${e.tag}.${e.cls}`).join(', ') : '0 hidden');

    const motion = await eval2(`(() => {
      let animating = 0, transitioning = 0;
      for (const el of document.querySelectorAll('main *')) {
        const cs = getComputedStyle(el);
        if (cs.animationName && cs.animationName !== 'none') animating++;
        if (cs.transitionDuration && !/^0s(, 0s)*$/.test(cs.transitionDuration)
            && parseFloat(cs.transitionDuration) > 0.01) transitioning++;
      }
      return { animating, transitioning };
    })()`);
    record('reduced-motion: no CSS animation running', motion.animating === 0, `${motion.animating} running`);
    record('reduced-motion: no non-zero transitions', motion.transitioning === 0, `${motion.transitioning} transitioning`);
  } catch (e) {
    record('reduced-motion pass completed without throwing', false, e.message);
  } finally {
    try { ws2?.close(); } catch {}
    ch2.kill();
    await sleep(300);
    try { rmSync(profile2, { recursive: true, force: true }); } catch {}
  }
}

await checkReducedMotion();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.log('FAILED: ' + failed.map((f) => f.name).join('; '));
  process.exit(1);
}