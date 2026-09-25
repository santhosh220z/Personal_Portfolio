// Atelier Zero — procedural collage plates.
// Pure functions returning SVG strings. Deterministic (seeded) so the page
// is identical across composes. Project figures prefer raster assets when
// present; these plates are the designed fallback and the collage texture.

import { mulberry32, inRange } from "./tokens.js";

const ns = 'xmlns="http://www.w3.org/2000/svg"';
const ink = "#17150F";
const ink3 = "#6E6554";
const rule = "#CEC4AE";
const accent = "#E24A1F";
const paperDeep = "#E9E2D1";

function attrs(obj) {
  return Object.entries(obj)
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ");
}

function openSvg(w, h, squash = true) {
  return `<svg ${ns} viewBox="0 0 ${w} ${h}" ${squash ? `preserveAspectRatio="none"` : `preserveAspectRatio="xMidYMid meet"`} width="100%" height="100%" role="img" aria-hidden="true">`;
}

// Halftone raster — a dotted field, one row distorted into accent.
export function halftone(w = 1200, h = 800, opts = {}) {
  const rng = mulberry32(opts.seed ?? 7);
  const r0 = opts.r ?? 1.6;
  const step = opts.step ?? 16;
  const cells = [];
  let i = 0;
  for (let y = step / 2; y < h; y += step) {
    for (let x = step / 2; x < w; x += step) {
      const wobble = inRange(rng, -1.4, 1.4);
      const r = Math.max(0.5, r0 + wobble);
      const hot = i % 211 === 0;
      cells.push(
        `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${hot ? accent : ink}" />`
      );
      i++;
    }
  }
  return `${openSvg(w, h)}<rect width="${w}" height="${h}" fill="${paperDeep}"/>${cells.join("")}</svg>`;
}

// Scanline field — fine horizontal rules with one group pulled into accent.
export function scanlines(w = 1200, h = 800, opts = {}) {
  const step = opts.step ?? 7;
  const lines = [];
  let y = step;
  let i = 0;
  while (y < h) {
    const hot = i % 97 === 0 && i > 400;
    lines.push(
      `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${hot ? accent : ink3}" stroke-width="${hot ? 2 : 0.5}" opacity="${hot ? 0.9 : 0.45}"/>`
    );
    y += step;
    i++;
  }
  return `${openSvg(w, h)}<rect width="${w}" height="${h}" fill="${paperDeep}"/>${lines.join("")}</svg>`;
}

// Iso-contour field — layered sine curves like a printed topo study.
export function iso(w = 1200, h = 800, opts = {}) {
  const rng = mulberry32(opts.seed ?? 13);
  const rows = [];
  for (let base = 0; base < h; base += 54) {
    const phase = inRange(rng, 0, Math.PI * 2);
    const amp = inRange(rng, 14, 30);
    const freq = inRange(rng, 0.003, 0.006);
    const hot = Math.random() > 0.9;
    const d = [];
    for (let x = 0; x <= w; x += 6) {
      const y = base + Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 2.3 + phase * 2) * amp * 0.4;
      d.push(`${x === 0 ? "M" : "L"}${x},${y.toFixed(1)}`);
    }
    rows.push(
      `<path d="${d.join(" ")}" fill="none" stroke="${hot ? accent : ink}" stroke-width="${hot ? 1.6 : 0.9}" opacity="${hot ? 0.9 : 0.5}"/>`
    );
  }
  return `${openSvg(w, h)}<rect width="${w}" height="${h}" fill="${paperDeep}"/>${rows.join("")}</svg>`;
}

// Wireframe network — nodes and edges, a hand-drawn "system" diagram.
export function network(w = 1200, h = 800, opts = {}) {
  const rng = mulberry32(opts.seed ?? 29);
  const n = opts.nodes ?? 22;
  const pts = [];
  for (let i = 0; i < n; i++) {
    pts.push({ x: inRange(rng, 30, w - 30), y: inRange(rng, 30, h - 30), r: inRange(rng, 3, 7) });
  }
  const edges = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (rng() < 0.085) {
        edges.push(
          `<line x1="${pts[i].x.toFixed(1)}" y1="${pts[i].y.toFixed(1)}" x2="${pts[j].x.toFixed(1)}" y2="${pts[j].y.toFixed(1)}" stroke="${ink3}" stroke-width="0.7" opacity="0.55"/>`
        );
      }
    }
  }
  const nodesSvg = pts
    .map((p, i) => {
      const hot = i % 23 === 0;
      return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${hot ? p.r + 2 : p.r}" fill="${hot ? accent : ink}" opacity="${hot ? 1 : 0.85}"/>`;
    })
    .join("");
  return `${openSvg(w, h)}<rect width="${w}" height="${h}" fill="${paperDeep}"/>${edges.join("")}${nodesSvg}</svg>`;
}

// Spectrum bars — a measured stat block, one column loud.
export function bars(w = 1200, h = 800, opts = {}) {
  const rng = mulberry32(opts.seed ?? 41);
  const n = opts.bars ?? 26;
  const bw = w / (n + 4);
  const cols = [];
  for (let i = 0; i < n; i++) {
    const bh = inRange(rng, h * 0.12, h * 0.92);
    const hot = i === Math.floor(n * 0.62);
    cols.push(
      `<rect x="${(i + 2) * bw + bw * 0.25}" y="${(h - bh).toFixed(1)}" width="${bw * 0.5}" height="${bh.toFixed(1)}" fill="${hot ? accent : ink}" opacity="${hot ? 1 : 0.82}"/>`
    );
  }
  return `${openSvg(w, h)}<rect width="${w}" height="${h}" fill="${paperDeep}"/>${cols.join("")}</svg>`;
}

// Concentric rings — a printed "aperture", rotated edges.
export function rings(w = 1200, h = 1200, opts = {}) {
  const cx = w / 2;
  const cy = h / 2;
  const rng = mulberry32(opts.seed ?? 53);
  const ring = [];
  for (let r = 40; r < Math.min(w, h) * 0.62; r += 22) {
    const wob = inRange(rng, -3, 3);
    const hot = r % 11 === 0 && r > 200;
    ring.push(
      `<circle cx="${cx}" cy="${cy}" r="${r + wob}" fill="none" stroke="${hot ? accent : ink}" stroke-width="${hot ? 2 : 1}" opacity="${hot ? 1 : 0.55}"/>`
    );
  }
  return `${openSvg(w, h, false)}<rect width="${w}" height="${h}" fill="${paperDeep}"/>${ring.join("")}<circle cx="${cx}" cy="${cy}" r="10" fill="${accent}"/></svg>`;
}

// Hand-tracking landmarks — a MediaPipe-style field study.
// Palm + five fingers of connected landmarks, a caption for assistive tech.
export function hand(w = 1200, h = 900, opts = {}) {
  const rng = mulberry32(opts.seed ?? 61);
  const palm = { x: w * 0.5, y: h * 0.62 };
  const fingers = [
    // thumb, index, middle, ring, pinky — each with 4 joints
    Math.PI * 0.92,
    Math.PI * 0.62,
    Math.PI * 0.5,
    Math.PI * 0.38,
    Math.PI * 0.2,
  ];
  const L = [];
  const M = [];
  const draw = [];
  fingers.forEach((ang, f) => {
    let px = palm.x;
    let py = palm.y;
    const baseLen = inRange(rng, h * 0.08, h * 0.11);
    for (let joint = 0; joint < 4; joint++) {
      const nx = px + Math.cos(ang) * baseLen;
      const ny = py - Math.sin(ang - Math.PI / 2) * baseLen;
      draw.push(
        `<line x1="${px.toFixed(1)}" y1="${py.toFixed(1)}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="${ink3}" stroke-width="1.1" opacity="0.7"/>`
      );
      M.push(`<circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="3.2" fill="${ink}"/>`);
      px = nx;
      py = ny;
    }
  });
  L.push(`<circle cx="${palm.x}" cy="${palm.y}" r="14" fill="none" stroke="${accent}" stroke-width="2"/>`);
  return `${openSvg(w, h)}<rect width="${w}" height="${h}" fill="${paperDeep}"/>${draw.join("")}${M.join("")}${L.join("")}</svg>`;
}

// Crosshair — an offset registration mark with a ruled margin.
export function crosshair(w = 1200, h = 800) {
  return `${openSvg(w, h)}<rect x="2" y="2" width="${w - 4}" height="${h - 4}" fill="none" stroke="${rule}" stroke-width="1.5"/>${[
    `<line x1="${w * 0.18}" y1="${h * 0.1}" x2="${w * 0.18}" y2="${h * 0.62}" stroke="${ink}" stroke-width="1" opacity="0.5"/>`,
    `<line x1="${w * 0.18}" y1="${h * 0.1}" x2="${w * 0.62}" y2="${h * 0.1}" stroke="${ink}" stroke-width="1" opacity="0.5"/>`,
    `<circle cx="${w * 0.18}" cy="${h * 0.1}" r="46" fill="none" stroke="${accent}" stroke-width="1.4"/>`,
    `<circle cx="${w * 0.18}" cy="${h * 0.1}" r="5" fill="${accent}"/>`,
  ].join("")}</svg>`;
}

// Grain — a tiny noise tile, used once as a page texture.
export function grainTile() {
  return `<svg ${ns} width="160" height="160" viewBox="0 0 160 160"><filter id="az-grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="160" height="160" filter="url(#az-grain)" opacity="0.05"/></svg>`;
}

const plateRegistry = {
  halftone,
  scanlines,
  iso,
  network,
  bars,
  rings,
  hand,
  crosshair,
};

export function plate(name, w, h, opts) {
  const fn = plateRegistry[name] ?? halftone;
  return fn(w, h, opts ?? {});
}