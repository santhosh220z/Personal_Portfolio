// Theme resolution. The inline script in index.html must stay in sync with
// `resolveMode()` here — it runs before React mounts to avoid a flash of the
// wrong colour scheme, and this module is the single source for changes made
// at runtime.

export const STORAGE_KEY = 'theme';

export function resolveMode() {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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
