// Atelier Zero — design tokens and render helpers (pure functions, no I/O).

export const tokens = {
  paper: "#F4F0E6",
  paperDeep: "#E9E2D1",
  paperDim: "#DBD2BB",
  ink: "#17150F",
  ink2: "#3E382B",
  ink3: "#6E6554",
  rule: "#CEC4AE",
  accent: "#E24A1F",
  accentDeep: "#A9320F",
  accent2: "#2E4A9E",
  white: "#FBF8F2",
};

export const fonts = {
  display: '"Fraunces", "Iowan Old Style", Georgia, serif',
  sans: '"Archivo", "Helvetica Neue", Arial, sans-serif',
  mono: '"Space Mono", "SFMono-Regular", Consolas, monospace',
};

export const scale = {
  hero: "clamp(3.4rem, 9vw, 8.2rem)",
  heroLine: "0.98",
  section: "clamp(2.1rem, 4.5vw, 3.6rem)",
  sectionLine: "1.04",
  lede: "clamp(1.2rem, 2vw, 1.45rem)",
  body: "1.0625rem",
  bodyLine: "1.72",
  small: "0.75rem",
  cap: "0.72rem",
  capTrack: "0.14em",
  label: "0.7rem",
  labelTrack: "0.18em",
};

// HTML escape for text nodes.
export function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// Deterministic pseudo-random from a seed (for procedural plates).
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function inRange(rng, min, max) {
  return min + rng() * (max - min);
}