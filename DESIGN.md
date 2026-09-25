# Atelier Zero — Editorial Portfolio System

A visual language for the Santhosh Sunkara personal portfolio. The site is treated as
an independent design publication — closer to a Monocle / Apartamento / Études Studio
spread than a conventional personal website. Everything is composed on a warm paper
ground, set in contrasty editorial type, and edited down to essentials.

---

## 1. Point of view

The reader is a curator, not a user. The page should feel like a printed
monograph that happens to scroll: numbered movements, oversized headlines, marginalia,
figures with captions, thin rules, deliberate asymmetry, and one restrained accent.
Tempo matters more than density. Every surface is paper; every edge is a rule;
no glass, no gradients, no rounded cards.

## 2. Material & colour

Monochrome foundations with a single warm accent. Ink is warm-black, never pure.

| Token        | Value     | Usage                                    |
| ------------ | --------- | ---------------------------------------- |
| `paper`      | `#F4F0E6` | page ground                              |
| `paper-deep` | `#E9E2D1` | inset panels, plates                      |
| `ink`        | `#17150F` | headlines                                |
| `ink-2`      | `#3E382B` | body text                                |
| `ink-3`      | `#6E6554` | captions, marginalia, meta               |
| `rule`       | `#CEC4AE` | hairlines                                |
| `accent`     | `#E24A1F` | vermilion — the one loud note             |
| `accent-2`   | `#2E4A9E` | signal blue — one competitor is allowed, seldom |

Rules govern: use accent for numbers, one underline, the availability dot, the
contact arrow. Never more than ~5% of any viewport painted accent.

## 3. Typography

Three voices, never more:

- **Fraunces** (variable serif) — display. Oversized, optically small, `wght 560–620`,
  tight leading, `-0.02em`. Itals for emphasis.
- **Archivo** (grotesk) — body and labels. Uppercase + wide tracking for kickers.
- **Space Mono** — captions, figures, metadata, marginalia. All-caps, letterspaced.

Scale (fluid): hero `clamp(3.4rem, 9vw, 8.2rem)`, section `clamp(2.1rem, 4.5vw, 3.6rem)`,
lede `1.25rem`, body `1.0625rem/1.72`, caption `0.72rem` tracking `0.14em`.

## 4. Layout grammar

- 12-column grid with generous margins (`clamp(1.25rem, 4vw, 4.5rem)`), full-bleed allowed.
- Sections open with a numbered kicker and a hairline: `02 — Featured Work`.
- Asymmetry is composed: images hug one column, text the other; offsets of
  `12–16%` are normal; nothing is centered except some colophons.
- Figure captions sit *inside* the composition, under or beside the plate,
  prefixed `Fig. 01 —`.
- Tables of metadata (role, years, stack, client) are set in mono, ruled by hairlines
  — never chips, never pills, never progress bars.
- Whitespace is a material. Sections breathe; the gutters do the heavy lifting.

## 5. Collage & imperfection

- Tactile plates: halftone rasters, scanlines, iso-contour fields, wireframe
  network diagrams, spectrum bars — generated procedurally, used as stand-ins
  for photography, or layered behind printed imagery.
- Slight rotation on plates (`-1.5deg`), uneven rules, oversized numerals that
  bleed off the page edge. Imperfection is applied deliberately, once per view.
- Optional: up to 16 bespoke gpt-image-2 collage assets in the Atelier Zero style
  (`scripts/generate-assets.js`). The composer prefers raster assets when present
  and falls back to procedural plates.

## 6. Motion (subtle, editorial)

- **Scroll reveal** — elements lift `26px` and fade over `0.8s` with a staggered
  `0.06s` per sibling. Never more than one in-production reveal per viewport.
- **Headroom navigation** — the masthead hides on scroll-down, returns on
  scroll-up or at the top. No shrink effects, no blur glass.
- **No autoplay, no marquees, no parallax scrims.**
- `prefers-reduced-motion` renders everything static and visible.

## 7. Accessibility & craft

Warm paper + ink delivers AA contrast at body sizes. Semantic landmarks
(`header`, `main`, `section`, `figure`, `footer`), a skip link, real alt text,
`aria-label`d links, keyboard-visible focus in accent, and `scroll-margin`
for anchored sections. The output is a self-contained single HTML file:
compose in, print out.

## 8. Implementation

- `inputs.json` — the typed brief (person, manifesto, projects, etc.).
- `scripts/lib/tokens.js` — design tokens & helpers.
- `scripts/lib/plates.js` — procedural collage plates.
- `scripts/lib/sections.js` — pure section renderers.
- `scripts/compose.js` — pure `compose(inputs) → html`, CLI at the bottom.
- `scripts/generate-assets.js` — optional gpt-image-2 asset generation.
- Output: `dist/index.html`, mirrored to `apps/landing-page/index.html`.