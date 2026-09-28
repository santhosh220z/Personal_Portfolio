import React from 'react';

/**
 * Abstract geometric motifs — the non-semantic sibling of MLMotif.
 *
 * These carry no diagrammatic meaning. They exist to give each section of the
 * page a piece of drafting in its negative space, so a long scroll is not just a
 * stack of bordered tables. Every one of them is built from the same three
 * constraints:
 *
 *   - `currentColor`, so a motif inherits the accent from its parent and follows
 *     a theme swap with no second set of values;
 *   - `vector-effect: non-scaling-stroke`, which holds the hairline at 1px no
 *     matter how large the shape is rendered. Note this only affects STROKES —
 *     circle and rect radii still scale with the viewBox, which is why the
 *     viewBoxes here are deliberately coarse. A 100-unit box stretched to 600px
 *     turns an r=2 dot into a 12px blob;
 *   - generated geometry rather than markup, so a motif is a few nodes instead
 *     of a few hundred.
 */

/** Mulberry32 — deterministic, so a motif is identical on every render. */
const rng = (seed) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** `M x y L x y` pairs collapsed into one path, so edges cost one node. */
const polyline = (pairs) =>
  pairs.map(([x1, y1, x2, y2], i) => `${i ? 'L' : 'M'}${x1} ${y1}L${x2} ${y2}`).join('');

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1,
  vectorEffect: 'non-scaling-stroke',
};

const FILL = {
  fill: 'currentColor',
  vectorEffect: 'non-scaling-stroke',
};

const SHELL = (viewBox, children, className) => (
  <svg
    viewBox={viewBox}
    className={`overflow-visible ${className}`}
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);

/** Concentric rings sharing a centre — the plainest way to fill a corner. */
export const Rings = ({ className = '', count = 4 }) => (
  <svg
    viewBox="0 0 200 200"
    className={`overflow-visible ${className}`}
    aria-hidden="true"
    focusable="false"
  >
    {Array.from({ length: count }, (_, i) => (
      <circle
        key={i}
        cx="100"
        cy="100"
        // Even spacing rather than a geometric ratio: a 1.6x step looks like
        // perspective, which is a different idea from concentric.
        r={18 + i * 22}
        {...STROKE}
        opacity={0.5 - i * 0.09}
      />
    ))}
  </svg>
);

/**
 * A quarter arc. The straight edges of the quadrant land on the corners of the
 * box, which is the only place a cropped circle does not read as a mistake.
 */
export const ArcQuarter = ({ className = '' }) => (
  <svg
    viewBox="0 0 120 120"
    className={`overflow-visible ${className}`}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M6 114A108 108 0 0 1 114 6" {...STROKE} />
    <path d="M6 84A78 78 0 0 1 84 6" {...STROKE} opacity="0.55" />
    <path d="M6 54A48 48 0 0 1 54 6" {...STROKE} opacity="0.3" />
  </svg>
);

/** A single hairline circle, for when a ring would be too much. */
export const Circle = ({ className = '' }) => (
  <svg
    viewBox="0 0 100 100"
    className={`overflow-visible ${className}`}
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="50" cy="50" r="47" {...STROKE} />
  </svg>
);

/** Triangle outlines in a row, alternating direction like a sawtooth. */
export const Triangles = ({ className = '', count = 3 }) => (
  <svg
    viewBox="0 0 200 120"
    className={`overflow-visible ${className}`}
    aria-hidden="true"
    focusable="false"
  >
    {Array.from({ length: count }, (_, i) => {
      const w = 200 / count;
      const x = i * w;
      const flip = i % 2 === 1;
      return (
        <path
          key={i}
          d={
            flip
              ? `M${x} 8L${x + w / 2} 112L${x + w} 8Z`
              : `M${x} 112L${x + w / 2} 8L${x + w} 112Z`
          }
          {...STROKE}
          opacity={0.45}
        />
      );
    })}
  </svg>
);

/** A hexagon tessellation. Six is the least regular tiling that still reads as
 *  deliberate rather than as a grid rotated by accident. */
const HEX = (() => {
  const r = 14;
  const dx = r * 1.732;
  const dy = r * 1.5;
  const cols = 7;
  const rows = 5;
  const hexes = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = 14 + col * dx + (row % 2 ? dx / 2 : 0);
      const cy = 14 + row * dy;
      if (cx > 214) continue;
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (60 * i - 30) * (Math.PI / 180);
        return `${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
      });
      hexes.push(`M${pts.join('L')}Z`);
    }
  }
  return hexes;
})();

export const HexField = ({ className = '' }) => (
  <svg
    viewBox="0 0 220 130"
    className={`overflow-visible ${className}`}
    aria-hidden="true"
    focusable="false"
  >
    {HEX.map((d, i) => (
      <path key={i} d={d} {...STROKE} opacity={0.16 + ((i % 5) * 0.05)} />
    ))}
  </svg>
);

/** Parallel diagonals at 45deg. Cheap to place in a corner, reads as hatching. */
export const Hatch = ({ className = '', count = 9, gap = 22 }) => {
  const lines = Array.from({ length: count }, (_, i) => [i * gap - 60, 0, i * gap + 60, 120]);
  return SHELL('0 0 200 120', <path d={polyline(lines)} {...STROKE} opacity="0.4" />, className);
};

/** A dot field with a soft radial falloff, so it fades instead of ending. */
export const DotField = ({ className = '', count = 120 }) => {
  const r = rng(0x7ac1);
  const dots = Array.from({ length: count }, () => {
    const x = r() * 200;
    const y = r() * 120;
    // Larger, dimmer dots toward the edge approximates a mask without one.
    const edge = Math.min(1, (Math.hypot(x - 100, y - 60) / 115) ** 1.6);
    return [x, y, 0.7 + edge * 1.5, (1 - edge * 0.75).toFixed(2)];
  });
  return SHELL(
    '0 0 200 120',
    dots.map(([x, y, rad, o], i) => (
      <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={rad.toFixed(2)} {...FILL} opacity={o} />
    )),
    className,
  );
};

/** Diamond lattice. A grid rotated 45deg, which is enough difference from a
 *  square grid to avoid reading as a second copy of one. */
export const Lattice = ({ className = '', n = 6, step = 30 }) => {
  const seg = [];
  for (let i = -n; i <= n * 2; i++) {
    const o = i * step;
    seg.push([o, 0, o + 120, 120], [o, 120, o + 120, 0]);
  }
  return SHELL('0 0 220 120', <path d={polyline(seg)} {...STROKE} opacity="0.32" />, className);
};

/** A stack of chevrons. Reads as direction, which suits a pipeline section. */
export const Chevrons = ({ className = '', count = 4 }) => (
  <svg
    viewBox="0 0 200 140"
    className={`overflow-visible ${className}`}
    aria-hidden="true"
    focusable="false"
  >
    {Array.from({ length: count }, (_, i) => (
      <path
        key={i}
        d={`M10 ${34 + i * 26}L100 ${8 + i * 26}L190 ${34 + i * 26}`}
        {...STROKE}
        opacity={0.5 - i * 0.1}
      />
    ))}
  </svg>
);

/** A plus-mark grid. Ordinal and technical without being a diagram of anything. */
export const PlusGrid = ({ className = '', cols = 5, rows = 5, gap = 40 }) => {
  const marks = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = 20 + c * gap;
      const y = 20 + r * gap;
      marks.push([x - 6, y, x + 6, y], [x, y - 6, x, y + 6]);
    }
  }
  return SHELL(
    `0 0 ${20 + (cols - 1) * gap + 20} ${20 + (rows - 1) * gap + 20}`,
    <path d={polyline(marks)} {...STROKE} opacity="0.45" />,
    className,
  );
};

/** A stepped staircase. Suits a section about a pipeline of stages. */
export const Steps = ({ className = '', steps = 4 }) => (
  <svg
    viewBox="0 0 200 120"
    className={`overflow-visible ${className}`}
    aria-hidden="true"
    focusable="false"
  >
    <path
      d={Array.from({ length: steps }, (_, i) => {
        const x = 10 + i * ((180 / steps));
        const y = 110 - i * (80 / steps);
        return `${i ? 'L' : 'M'}${x.toFixed(0)} 110L${x.toFixed(0)} ${y.toFixed(0)}L${(x + 180 / steps).toFixed(0)} ${y.toFixed(0)}`;
      }).join('')}
      {...STROKE}
    />
  </svg>
);

/** A short crosshair with a broken ring — a survey mark, not a target. */
export const Crosshair = ({ className = '' }) => (
  <svg
    viewBox="0 0 100 100"
    className={`overflow-visible ${className}`}
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="50" cy="50" r="26" {...STROKE} strokeDasharray="30 12" />
    <path d="M50 8V36M50 64V92M8 50H36M64 50H92" {...STROKE} />
    <circle cx="50" cy="50" r="2.6" {...FILL} />
  </svg>
);

/** A long shallow arc — a horizon. The one motif here with no hard corner. */
export const Sweep = ({ className = '' }) => (
  <svg
    viewBox="0 0 240 60"
    className={`overflow-visible ${className}`}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M4 56A116 116 0 0 1 236 56" {...STROKE} />
    <path d="M40 56A80 80 0 0 1 200 56" {...STROKE} opacity="0.45" />
  </svg>
);
