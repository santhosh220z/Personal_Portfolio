// Theme resolution. The inline script in index.html must stay in sync with
// `resolveMode()` here — it runs before React mounts to avoid a flash of the
// wrong colour scheme, and this module is the single source for changes made
// at runtime.

export const STORAGE_KEY = 'theme';

/**
 * Dark is the default, NOT the OS preference. The acid accent and the outlined
 * display type were tuned against charcoal first, so an OS set to light should
 * still land on the intended art direction until the visitor says otherwise.
 * This is the one place that decision lives — index.html mirrors it.
 */
export const DEFAULT_MODE = 'dark';

export function readStored() {
  // Safari private mode and "block all cookies" both make localStorage throw
  // on access, not just on write, so the read needs the same guard.
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function resolveMode() {
  if (typeof window === 'undefined') return DEFAULT_MODE;
  const stored = readStored();
  if (stored === 'light' || stored === 'dark') return stored;
  return DEFAULT_MODE;
}

export function applyMode(mode) {
  document.documentElement.setAttribute('data-theme', mode);
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Private browsing can throw on localStorage; the attribute is still set,
    // so the page stays correct for this session.
  }
}
