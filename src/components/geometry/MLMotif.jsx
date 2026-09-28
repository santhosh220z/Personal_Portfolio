import React from 'react';

/**
 * Machine-learning diagrams, used as the decorative vocabulary of the hero.
 *
 * These replace the hand-drawn scribbles and the generic arcs that used to
 * dress the portrait. A circle and a square are decoration: they say nothing.
 * A three-layer network, a separating decision boundary and a validation curve
 * say something specific, and on a portfolio for an applied ML engineer the
 * shapes are then doing the same work as the copy instead of competing with it.
 *
 * Every motif is:
 *   - `currentColor`, so it inherits the accent from the parent and follows a
 *     theme swap without a second set of values;
 *   - drawn with `vector-effect: non-scaling-stroke`, keeping the hairline at
 *     1px however large the diagram is rendered;
 *   - `aria-hidden` and non-interactive — they are scenery, and the portrait's
 *     pointer tracking must not have to fight them for hit-testing.
 *
 * All coordinates are generated once at module load from a seeded generator.
 * `Math.random` would redraw the diagram on every render and would differ
 * between server and client, so a fixed seed is what keeps these stable.
 */

/** Mulberry32 — small, fast, and deterministic for a given seed. */
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

/** Joins `M x y L x y` pairs into one path so a diagram is a single node. */
const polyline = (pairs) =>
  pairs.map(([x1, y1, x2, y2], i) => `${i ? 'L' : 'M'}${x1} ${y1}L${x2} ${y2}`).join('');

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1,
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

/* -------------------------------------------------------------------------- *
 * A feed-forward network — the most legible "this is ML" shape there is. Drawn
 * as one edge path plus the node circles so the whole thing stays a handful of
 * DOM nodes rather than one per connection.
 *
 * 3-4-2 rather than something denser. This diagram is used at 352px in the
 * backdrop and at 87px beside the portrait, and a 4-5-3 net (35 edges) collapses
 * into a solid mesh at the smaller of those: there is no room for the
 * connections to read as connections. Fewer layers is what keeps it a diagram
 * at both sizes.
 * -------------------------------------------------------------------------- */
const NET_LAYERS = [
  { x: 7, ys: [16, 39, 62] },
  { x: 54, ys: [9, 29, 49, 69] },
  { x: 101, ys: [24, 54] },
];

const NET_EDGES = (() => {
  const out = [];
  for (let i = 0; i < NET_LAYERS.length - 1; i++) {
    for (const y1 of NET_LAYERS[i].ys) {
      for (const y2 of NET_LAYERS[i + 1].ys) {
        out.push([NET_LAYERS[i].x, y1, NET_LAYERS[i + 1].x, y2]);
      }
    }
  }
  return out;
})();

export const NeuralNet = ({ className = '' }) =>
  SHELL(
    '0 0 108 78',
    <>
      <path d={polyline(NET_EDGES)} {...STROKE} opacity="0.32" />
      {NET_LAYERS.flatMap((layer) =>
        layer.ys.map((y) => <circle key={`${layer.x}-${y}`} cx={layer.x} cy={y} r="1.9" fill="currentColor" opacity="0.6" />),
      )}
    </>,
    className,
  );

/* -------------------------------------------------------------------------- *
 * Two clusters and the line that separates them. The specific thing an ML
 * practitioner recognises instantly: classification, and the boundary that a
 * model has to learn.
 * -------------------------------------------------------------------------- */
const CLUSTERS = (() => {
  const r = rng(0x51fe);
  const cluster = (cx, cy, spread, n) =>
    Array.from({ length: n }, () => {
      // Box-Muller-ish radial squash, so dots thin out toward the edge the way a
      // real gaussian does instead of filling a square.
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r()) * spread;
      return [cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.78];
    });
  return { a: cluster(46, 27, 26, 16), b: cluster(107, 66, 24, 14) };
})();

export const ScatterCluster = ({ className = '' }) => {
  const all = [...CLUSTERS.a, ...CLUSTERS.b];
  return SHELL(
    '0 0 150 92',
    <>
      <path d="M8 86L142 6" {...STROKE} strokeDasharray="3 4" opacity="0.5" />
      {all.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.7" fill="currentColor" opacity="0.42" />
      ))}
    </>,
    className,
  );
};

/* -------------------------------------------------------------------------- *
 * Training loss against validation loss, including the point where validation
 * turns back up. Overfitting is the single most-referenced idea in applied ML
 * and it is legible without a legend.
 * -------------------------------------------------------------------------- */
export const LossCurve = ({ className = '' }) =>
  SHELL(
    '0 0 150 76',
    <>
      <path d="M4 4V68H146" {...STROKE} opacity="0.28" />
      {/* train: falls steeply then flattens */}
      <path d="M10 8C40 34 62 48 96 56C114 60 130 62 144 63" {...STROKE} opacity="0.7" />
      {/* validation: falls, bottoms out, then rises — the overfit turn */}
      <path
        d="M10 8C44 38 66 50 92 54C112 57 126 48 144 26"
        {...STROKE}
        strokeDasharray="4 3"
        opacity="0.45"
      />
      <circle cx="92" cy="54" r="1.8" fill="currentColor" opacity="0.6" />
    </>,
    className,
  );

/* -------------------------------------------------------------------------- *
 * An attention / feature-activation matrix: a low-res grid whose cell opacities
 * stand in for a softmax. Reads as "weights" at a glance and is the most
 * texture-like of the set, so it works as a field rather than a diagram.
 * -------------------------------------------------------------------------- */
const ATTENTION = (() => {
  const r = rng(0x9a17);
  const n = 10;
  const cells = [];
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      // Bias each row toward a different column so the grid has structure —
      // uniform noise would read as a dirty screen, not as a matrix.
      const bias = Math.exp(-Math.abs(col - ((row * 3) % n)) * 0.55);
      const v = bias * (0.45 + r() * 0.55);
      cells.push([col, row, 0.1 + v * 0.72]);
    }
  }
  return { n, cells };
})();

export const AttentionGrid = ({ className = '' }) => {
  const { n, cells } = ATTENTION;
  const step = 100 / n;
  const gap = step * 0.16;
  return SHELL(
    '0 0 100 100',
    <>
      {cells.map(([col, row, o]) => (
        <rect
          key={`${row}-${col}`}
          x={col * step + gap / 2}
          y={row * step + gap / 2}
          width={step - gap}
          height={step - gap}
          fill="currentColor"
          opacity={o}
        />
      ))}
    </>,
    className,
  );
};

/* -------------------------------------------------------------------------- *
 * A single sigmoid. The activation every first neural net is built from, and a
 * pleasing single gesture to place on its own.
 * -------------------------------------------------------------------------- */
export const SigmoidCurve = ({ className = '' }) =>
  SHELL(
    '0 0 120 62',
    <>
      <path d="M4 4V56H116" {...STROKE} opacity="0.28" />
      <path d="M8 52C26 52 34 48 42 40C52 30 56 12 72 8C86 5 96 8 112 8" {...STROKE} opacity="0.7" />
    </>,
    className,
  );

/* -------------------------------------------------------------------------- *
 * A k-nearest-neighbour graph in embedding space: points on a ring, each joined
 * to its closest neighbours, with one query point picked out and linked to its
 * own three. This is the motif that belongs on the portrait specifically — a
 * halo of samples with one highlighted query reads as an embedding space, and
 * it sits around the head the way a halo should instead of being a ring drawn
 * for its own sake.
 * -------------------------------------------------------------------------- */
const ORBIT = (() => {
  const n = 12;
  const c = 100;
  // 60 of 200 units. The box is 336px wide and the orbit is drawn at 105% of
  // it, so this lands at a 106px radius — just outside the head's 79px
  // half-width. The first pass used 84, which pushed the ring to 148px and
  // scattered the samples so far from the silhouette that the halo stopped
  // reading as a halo and became loose dots on the canvas.
  const r = 60;
  const points = Array.from({ length: n }, (_, i) => {
    // Start at -90deg so the ring has a node at the top, which keeps the crown
    // from being the one part of the circle with nothing on it.
    const a = (-90 + (360 / n) * i) * (Math.PI / 180);
    return [c + Math.cos(a) * r, c + Math.sin(a) * r];
  });
  const query = 3;
  const neighbours = [query - 2, query + 1, query + 2].map((i) => (i + n) % n);

  const ring = [];
  for (let i = 0; i < n; i++) {
    ring.push([...points[i], ...points[(i + 1) % n]]);
  }
  const spokes = neighbours.map((i) => [...points[query], ...points[i]]);

  return { points, query, neighbours, ring, spokes };
})();

export const NodeOrbit = ({ className = '' }) =>
  SHELL(
    '0 0 200 200',
    <>
      <path d={polyline(ORBIT.ring)} {...STROKE} opacity="0.22" />
      <path d={polyline(ORBIT.spokes)} {...STROKE} opacity="0.5" />
      {ORBIT.points.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i === ORBIT.query ? 3.2 : 1.6}
          fill="currentColor"
          opacity={i === ORBIT.query ? 0.9 : 0.38}
        />
      ))}
    </>,
    className,
  );

/* -------------------------------------------------------------------------- *
 * A sparse node-link graph, generated to fill an arbitrary area. This is the
 * backdrop's connective tissue: the specific diagrams above are the subjects,
 * and this is what keeps the space between them from reading as empty canvas.
 * `slice` lets one viewBox cover any aspect ratio without letterboxing.
 * -------------------------------------------------------------------------- */
const GRAPH = (() => {
  const r = rng(0x2f19);
  const cols = 13;
  const rows = 7;
  // A 640x360 viewBox, not the 160x90 this started on. `slice` scales a
  // 160x90 box to 10x on a 1440px hero, and while `non-scaling-stroke` holds the
  // *lines* at 1px, circle radii still scale with the viewBox — which turned
  // every node into a 20px blob and read as smudges rather than as a graph.
  // 640x360 lands the same diagram at a 2.25x scale, so nodes land at 2-4px.
  const nodes = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Jittered lattice: regular enough to read as a graph, irregular enough
      // that it does not read as a dot screen.
      const x = ((col + 0.5 + (r() - 0.5) * 0.6) / cols) * 640;
      const y = ((row + 0.5 + (r() - 0.5) * 0.6) / rows) * 360;
      nodes.push([x, y, 0.8 + r() * 1.2]);
    }
  }
  // Join each node to the right and below neighbours, plus an occasional
  // diagonal. A distance threshold produced an unpredictable edge count; a
  // lattice guarantees a bounded, even weave.
  const edges = [];
  const at = (col, row) => (row < 0 || row >= rows ? null : nodes[row * cols + col]);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const a = at(col, row);
      const neighbours = [at(col + 1, row), at(col, row + 1)];
      if (r() > 0.55) neighbours.push(at(col + 1, row + 1));
      for (const b of neighbours) if (b) edges.push([a[0], a[1], b[0], b[1]]);
    }
  }
  return { nodes, edges };
})();

export const NodeGraph = ({ className = '' }) => (
  <svg
    viewBox="0 0 640 360"
    preserveAspectRatio="xMidYMid slice"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <path d={polyline(GRAPH.edges)} {...STROKE} opacity="0.34" />
    {GRAPH.nodes.map(([x, y, r], i) => (
      <circle key={i} cx={x} cy={y} r={r} fill="currentColor" opacity="0.4" />
    ))}
  </svg>
);
