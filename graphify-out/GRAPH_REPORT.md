# Graph Report - .  (2026-08-20)

## Corpus Check
- Corpus is ~23,136 words - fits in a single context window. You may not need a graph.

## Summary
- 87 nodes · 100 edges · 28 communities (15 shown, 13 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Package Configuration
- Core App Components
- React Dependencies
- Feature Components
- HTML Entry Point
- Dev Dependencies (Linting)
- Certifications & Google Cloud
- About & Profile
- @eslint/js
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- globals
- PostCSS
- TailwindCSS
- @types/react
- @types/react-dom
- Vite
- @vitejs/plugin-react
- Experience Component

## God Nodes (most connected - your core abstractions)
1. `SectionHeading()` - 8 edges
2. `scripts` - 5 edges
3. `framer-motion` - 2 edges
4. `lucide-react` - 2 edges
5. `react` - 2 edges
6. `react-dom` - 2 edges
7. `@eslint/js` - 2 edges
8. `@types/react` - 2 edges
9. `@types/react-dom` - 2 edges
10. `@vitejs/plugin-react` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **portfolio-entry** — index.html, main.jsx-entry, root-div, favicon.svg [EXTRACTED]

## Communities (28 total, 13 thin omitted)

### Community 0 - "Package Configuration"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 1 - "Core App Components"
Cohesion: 0.29
Nodes (5): App(), Education(), Footer(), Hero(), Navbar()

### Community 2 - "React Dependencies"
Cohesion: 0.22
Nodes (9): framer-motion, lucide-react, dependencies, framer-motion, lucide-react, react, react-dom, react (+1 more)

### Community 3 - "Feature Components"
Cohesion: 0.33
Nodes (4): Contact(), Projects(), SectionHeading(), Skills()

### Community 4 - "HTML Entry Point"
Cohesion: 0.40
Nodes (4): favicon.svg, main.jsx, portfolio, root

### Community 5 - "Dev Dependencies (Linting)"
Cohesion: 0.40
Nodes (5): autoprefixer, eslint, devDependencies, autoprefixer, eslint

## Knowledge Gaps
- **27 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+22 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Dependencies (Linting)` to `Package Configuration`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`, `PostCSS`, `TailwindCSS`, `@types/react`, `@types/react-dom`, `Vite`, `@vitejs/plugin-react`?**
  _High betweenness centrality (0.197) - this node is a cross-community bridge._
- **Why does `dependencies` connect `React Dependencies` to `Package Configuration`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _27 weakly-connected nodes found - possible documentation gaps or missing edges._