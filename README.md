# Santhosh Sunkara — portfolio

An editorial, magazine-style personal portfolio built with the **Atelier Zero** visual language — inspired by independent European publications (Monocle, Apartamento, Études Studio). A single self-contained HTML file composed from a typed brief.

## Visual Language

- **Paper ground**: warm off-white (`#F4F0E6`)
- **Ink**: warm black (`#17150F`), never pure
- **Single accent**: vermilion (`#E24A1F`) — used sparingly (~5%)
- **Typography**: Fraunces (display serif) + Archivo (grotesk) + Space Mono (captions)
- **Layout**: 12-column asymmetric grid, generous margins, hairline rules, numbered sections
- **Collage**: procedural SVG plates (halftone, scanlines, iso-contours, wireframes) + optional gpt-image-2 rasters

## Structure — Nine Movements

| # | Section | Anchor |
|---|---------|--------|
| 01 | Hero / Masthead | `#top` |
| 02 | Manifesto | `#manifesto` |
| 03 | Featured Work (4 studies) | `#work` |
| 04 | Brief Biography | `#about` |
| 05 | Experience & Collaborations | `#experience` |
| 06 | Studio — Four Rooms (Capabilities) | `#studio` |
| 07 | Credentials (18 Google Cloud badges) | `#credentials` |
| 08 | Field Notes / Journal | `#journal` |
| 09 | Contact | `#contact` |

## Quick Start

```bash
# Install deps (for lint)
npm install

# Build the portfolio
node scripts/compose.js

# Output: dist/index.html (canonical)
# Mirror: apps/landing-page/index.html
```

## Optional: Generate Bespoke Collage Assets

Requires an OpenAI API key with `gpt-image-2` access.

```bash
export OPENAI_API_KEY=sk-...
node scripts/generate-assets.js        # generates 16 PNGs to scripts/assets/collage/
node scripts/compose.js                # re-compose to fold them in
```

Dry-run to preview prompts:
```bash
node scripts/generate-assets.js --dry
```

## Architecture

```
inputs.json          ← typed portfolio brief (person, projects, experience, etc.)
DESIGN.md            ← Atelier Zero visual language spec
scripts/
  compose.js         ← CLI: reads inputs, resolves assets, emits HTML
  generate-assets.js ← optional gpt-image-2 asset generator
  lib/
    tokens.js        ← design tokens + helpers (pure)
    plates.js        ← procedural SVG collage plates (pure)
    sections.js      ← section renderers + CSS + client JS (pure)
```

**Pure-function core**: `compose(inputs, ctx) → html` in `scripts/lib/sections.js` — no I/O, deterministic.

## Output Features

- **Self-contained HTML** — inline CSS, JS, base64-embedded portrait, Google Fonts via `<link>`
- **Headroom nav** — hides on scroll-down, reveals on scroll-up / top
- **Scroll-reveal** — staggered lift/fade via IntersectionObserver
- **Active-section highlighting** in masthead
- **Mobile menu** (details/summary fallback)
- **Accessibility**: semantic landmarks, skip link, focus-visible, `prefers-reduced-motion`, AA contrast
- **No frameworks** — vanilla ES modules, runs in any modern browser

## Deploy

The `dist/index.html` (or `apps/landing-page/index.html`) is a static file — deploy to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

Current deployment: `santhosh_sunkara_portfolio.com` (CNAME in repo root).


