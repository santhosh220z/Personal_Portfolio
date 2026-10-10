import { existsSync } from 'node:fs';

/**
 * Locate a Chrome/Chromium/Edge binary to drive headless.
 *
 * This exists as a shared module because two scripts need it and the obvious
 * alternative - hardcoding a path in each - already shipped a bug: both scripts
 * listed only Windows locations, so the CI workflow failed on its first run with
 * `spawn chrome.exe ENOENT` on an ubuntu runner. Anything hardcoding a browser
 * path here will fail on every platform but the one it was written on.
 *
 * Order is preference, not platform detection: Chrome first where it exists,
 * then the Chromium builds most CI images ship, then Edge as the Windows
 * fallback. `CHROME_PATH` overrides everything for anyone with an unusual
 * install (Brave, a Canary build, a snap shim).
 *
 * Exported rather than run-on-import so the caller can decide what to do when
 * nothing is found — that decision differs between "fail the build" and
 * "fall back to a hand-drawn asset".
 */
const CANDIDATES = [
  // Explicit override wins.
  process.env.CHROME_PATH,

  // macOS
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',

  // Linux — GitHub's ubuntu images provide the first two
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/snap/bin/chromium',

  // Windows
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

export function findChrome() {
  return CANDIDATES.find((p) => p && existsSync(p)) ?? null;
}

/**
 * Flags for launching a browser that should not draw anything.
 *
 * `--no-sandbox` is not optional on Linux CI: the runner executes as a user
 * without the kernel privileges Chrome's sandbox needs, and without this the
 * process exits immediately rather than producing a page.
 */
export const HEADLESS_ARGS = [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--hide-scrollbars',
];