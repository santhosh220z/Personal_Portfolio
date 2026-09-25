// Atelier Zero — pure section renderers + document assembly.
// All functions are deterministic: given (inputs, context) they return HTML.

import { tokens, fonts, scale, esc, mulberry32 } from "./tokens.js";
import { plate } from "./plates.js";

// ---------------------------------------------------------------------------
// Small composition helpers
// ---------------------------------------------------------------------------

function num(tokens, value, cls = "") {
  return `<span class="num ${cls}" aria-hidden="true">${esc(value)}</span>`;
}

function ghost(value) {
  return `<span class="ghost" aria-hidden="true">${esc(value)}</span>`;
}

// Numbered section opener: "02 — Featured Work", hairline above.
function opener(k, label, id) {
  return `
  <div class="opener reveal">
    <div class="opener-rule" aria-hidden="true"></div>
    <p class="opener-line"><span class="opener-num">${esc(k)}</span><span class="opener-label">${esc(label)}</span></p>
    ${id ? `<p class="opener-idx">§ ${esc(id)}</p>` : ""}
  </div>`;
}

// A figure block: raster asset when available, otherwise a procedural plate.
function figureHtml(ctx, f, figNo) {
  const cap = f.caption ? `<figcaption class="cap fig-cap reveal"><span class="fig-num">Fig. ${esc(figNo)} —</span> ${esc(f.caption)}</figcaption>` : "";
  const inner = f.src
    ? `<img src="${esc(f.src)}" alt="${esc(f.caption || "")}" class="fig-img" loading="lazy" decoding="async"/>`
    : plate(f.plate || "halftone", 1200, 820, {});
  return `
  <figure class="fig reveal">
    <div class="fig-plate">${inner}</div>
    ${cap}
  </figure>`;
}

// Inline mono stack list, joined by ruled bullets.
function stackList(items) {
  return `<p class="stack">${items.map((s) => `<span>${esc(s)}</span>`).join('<span class="stack-sep" aria-hidden="true">·</span>')}</p>`;
}

function extAttrs(href) {
  const external = String(href).startsWith("http");
  return external ? ` target="_blank" rel="noopener noreferrer"` : "";
}

// ---------------------------------------------------------------------------
// Nav / masthead
// ---------------------------------------------------------------------------

function navHtml(inputs) {
  const p = inputs.person;
  const links = [
    ["#manifesto", "Statement"],
    ["#work", "Work"],
    ["#about", "Bio"],
    ["#studio", "Studio"],
    ["#journal", "Notes"],
    ["#contact", "Contact"],
  ].map(([href, label], i) => `<a href="${href}" data-nav>${esc(label)}</a>`).join("");

  return `
<header class="nav" id="masthead">
  <div class="nav-in">
    <a class="nav-word" href="#top" aria-label="Back to top">${esc(p.name)}</a>
    <nav class="nav-mov" aria-label="Sections">
      ${links}
    </nav>
    <div class="nav-tools">
      <span class="nav-ed cap">${esc(inputs.edition)}</span>
      <span class="avail cap"><i class="avail-dot" aria-hidden="true"></i>${esc(p.status.split(" — ")[0])}</span>
      <button class="nav-menu cap" id="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-drop">Menu</button>
    </div>
  </div>
  <div class="nav-drop" id="nav-drop" hidden>
    ${links}
  </div>
</header>`;
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function heroHtml(inputs, ctx) {
  const h = inputs.hero;
  const p = inputs.person;
  const lines = h.lines
    .map((line, i) => {
      const italic = line.endsWith(".") || i === h.lines.length - 1;
      const accentDot = line.endsWith(".");
      let text = esc(line);
      if (accentDot) text = text.replace(/\.$/, `<i class="tone" aria-hidden="true">.</i>`);
      return `<span class="hero-l reveal" style="--d:${(i * 0.08).toFixed(2)}s"><span ${italic ? 'class="si"' : ""}>${text}</span></span>`;
    })
    .join("");

  const marginalia = h.marginalia
    .map((m, i) => `
      <div class="margin-cell reveal" style="--d:${(0.24 + i * 0.06).toFixed(2)}s">
        <span class="cap margin-label">${esc(m.label)}</span>
        <span class="margin-value">${esc(m.value)}</span>
      </div>`)
    .join("");

  const portrait = ctx.images.portrait;
  return `
<section id="top" class="hero" aria-labelledby="hero-title">
  <div class="wrap hero-in">
    <div class="hero-copy">
      <p class="hero-issue cap reveal">${esc(inputs.edition)} — a personal monograph on machines that read the world</p>
      <h1 class="hero-display" id="hero-title">
        <span class="hero-lines">${lines}</span>
      </h1>
      <div class="hero-sub-grid">
        <p class="hero-sub reveal" style="--d:.18s">${esc(h.subline)}</p>
        <p class="hero-idx reveal" style="--d:.26s">${esc(p.indexLine)}</p>
      </div>
    </div>

    <aside class="hero-figure reveal" style="--d:.12s" aria-label="Portrait">
      <div class="portrait-stack">
        <div class="portrait-ghost">${ghost("AI")}</div>
        <figure class="portrait">
          ${portrait
            ? `<img src="${esc(portrait)}" alt="Portrait of ${esc(p.name)}, machine-learning engineer." class="portrait-img" decoding="async"/>`
            : plate("halftone", 1200, 1500, {})}
        </figure>
        <div class="portrait-tag cap">Fig. 00 — the operator<br/>${esc(p.disciplines)}</div>
      </div>
      <div class="plate-chip"><span class="cap">field study</span></div>
    </aside>

    <div class="hero-margin" aria-label="Quick facts">
      ${marginalia}
      <div class="margin-cell margin-count reveal" style="--d:.42s">
        <span class="cap margin-label">Movements</span>
        <span class="margin-value">${esc(String(inputs.movements)).padStart(2, "0")}</span>
      </div>
    </div>
  </div>
  <div class="hero-foot wrap cap" aria-hidden="true">
    <span>Composed in ${esc(p.residence.split(",")[0])}</span>
    <span>${esc(p.role)}</span>
    <span>Follow the signals ↓</span>
  </div>
</section>`;
}

// ---------------------------------------------------------------------------
// Manifesto
// ---------------------------------------------------------------------------

function manifestoHtml(inputs) {
  const m = inputs.manifesto;
  const paras = m.paragraphs
    .map((pText, i) => `<p class="reel-p ${i === 0 ? "reel-lede" : ""}" data-title=${esc(m.title)}>${esc(pText)}</p>`)
    .join("");

  return `
<section id="manifesto" class="section manifesto" aria-labelledby="man-title">
  <div class="wrap">
    ${opener("01", m.kicker.toUpperCase())}
    <div class="man-grid">
      <div class="man-main">
        <h2 class="man-title serif reveal" id="man-title">
          ${esc(m.title)}<i class="tone" aria-hidden="true">.</i>
        </h2>
        <div class="man-body">
          ${paras}
        </div>
        <p class="man-sig cap reveal">Signed — ${esc(inputs.person.name.split(" ").join(" "))}, ${esc(inputs.person.role.toLowerCase().replace(/ \/.*/, ""))}</p>
      </div>
      <aside class="man-pull">
        <div class="man-pull-inner reveal">
          <span class="cap man-pull-kicker">Marginal note</span>
          <blockquote class="man-quote">${esc(m.pullquote)}</blockquote>
          <span class="man-pull-ink" aria-hidden="true">✒</span>
        </div>
      </aside>
    </div>
    ${ghost("01")}
  </div>
</section>`;
}

// ---------------------------------------------------------------------------
// Featured work
// ---------------------------------------------------------------------------

function projectMeta(meta) {
  return `
  <dl class="meta">
    ${meta.map((row) => `<div class="meta-row"><dt class="cap">${esc(row.label)}</dt><dd>${esc(row.value)}</dd></div>`).join("")}
  </dl>`;
}

function projectHtml(ctx, pr, idx) {
  const swap = idx % 2 === 1 ? " swap" : "";
  const outcomes = pr.outcomes
    .map((o) => `<li class="outcome">${esc(o)}</li>`)
    .join("");
  const links = [];
  if (pr.links.code) links.push(`<a class="lin rev" href="${esc(pr.links.code)}" ${extAttrs(pr.links.code)} aria-label="Source code of ${esc(pr.title)}">Code ↗</a>`);
  const titles = `<span class="proj-k">${esc(pr.kind)}</span>`;
  const headline = `<span class="proj-title">${esc(pr.title)}</span>`;

  return `
<article class="proj reveal-g">
  <div class="proj-hd">
    <div class="proj-hd-l">
      ${num(tokens, pr.index)}
      <h3 class="proj-name serif">${headline}</h3>
    </div>
    <div class="proj-hd-r">
      ${titles}
      <span class="proj-year cap">${esc(pr.year)}</span>
    </div>
  </div>

  <div class="proj-grid${swap}">
    ${figureHtml(ctx, pr.figure, pr.index)}

    <div class="proj-body">
      <p class="proj-lead serif-i">${esc(pr.statement)}</p>
      <div class="proj-meta">${projectMeta(pr.meta)}</div>
      <div class="proj-bottom">
        ${outcomes ? `<ul class="outcomes">${outcomes}</ul>` : ""}
        <div class="proj-foot">
          ${stackList(pr.stack)}
          <div class="proj-links">${links.join("")}</div>
        </div>
      </div>
    </div>
  </div>
</article>`;
}

function workHtml(inputs, ctx) {
  return `
<section id="work" class="section work" aria-labelledby="work-title">
  <div class="wrap">
    ${opener("02", "Featured work — four studies")}
    <h2 class="sec-title serif reveal" id="work-title">Selected studies${`<i class="tone" aria-hidden="true">.</i>`}</h2>
    <div class="works">
      ${inputs.projects.map((pr, i) => projectHtml(ctx, pr, i)).join("")}
    </div>
  </div>
</section>`;
}

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------

function aboutHtml(inputs) {
  const a = inputs.about;
  const facts = a.facts
    .map((f) => `<div class="fact-row"><dt class="cap">${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`)
    .join("");
  const recog = a.recognition
    .map((r, i) => `<li><span class="cap recog-label">${esc(r.label)}</span><span>${esc(r.value)}</span></li>`)
    .join("");
  const paras = a.paragraphs.map((pText, i) => `<p class="${i === 0 ? "about-lede" : ""}">${esc(pText)}</p>`).join("");

  return `
<section id="about" class="section about" aria-labelledby="about-title">
  <div class="wrap">
    ${opener("03", a.kicker.toUpperCase())}
    <div class="about-grid">
      <div class="about-main">
        <h2 class="sec-title serif reveal" id="about-title">${esc(a.title)}</h2>
        <p class="about-head reveal">${esc(a.heading)}</p>
        <div class="about-body">${paras}</div>
        <p class="about-sign cap reveal">— ${esc(inputs.person.name)}</p>
      </div>
      <aside class="about-side">
        <div class="fact-panel reveal">
          <span class="cap panel-kicker">The record</span>
          <dl class="facts">${facts}</dl>
        </div>
        <div class="recog reveal">
          <span class="cap panel-kicker">Recognition</span>
          <ul class="recog-list">${recog}</ul>
        </div>
      </aside>
    </div>
    ${ghost("03")}
  </div>
</section>`;
}

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

function experienceHtml(inputs) {
  const rows = inputs.experience
    .map(
      (e) => `
  <article class="exp reveal">
    <div class="exp-cell exp-period cap">${esc(e.period)}</div>
    <div class="exp-cell exp-main">
      <h3 class="exp-role serif">${esc(e.role)}</h3>
      <p class="exp-org cap">${esc(e.organization)} · ${esc(e.place)}</p>
      <p class="exp-desc">${esc(e.description)}</p>
      <div class="exp-foot">${stackList(e.stack)}<span class="exp-note serif-i">${esc(e.note)}</span></div>
    </div>
    <div class="exp-cell exp-tag cap">${esc(e.period.split(" — ")[0])}</div>
  </article>`
    )
    .join("");

  return `
<section id="experience" class="section experience" aria-labelledby="exp-title">
  <div class="wrap">
    ${opener("04", "Experience & collaborations")}
    <h2 class="sec-title serif reveal" id="exp-title">Spent well,<i class="tone" aria-hidden="true">.</i></h2>
    <div class="exp-list">${rows}</div>
  </div>
</section>`;
}

// ---------------------------------------------------------------------------
// Capabilities — "the studio, four rooms"
// ---------------------------------------------------------------------------

function capabilitiesHtml(inputs) {
  const c = inputs.capabilities;
  const rooms = c.rooms
    .map((room) => `
  <div class="room reveal">
    <span class="room-roomie" aria-hidden="true">${esc(room.numeral)}</span>
    <h3 class="room-title serif">${esc(room.title)}</h3>
    <p class="room-note">${esc(room.note)}</p>
    <div class="room-items">${stackList(room.items)}</div>
  </div>`)
    .join("");

  return `
<section id="studio" class="section studio" aria-labelledby="studio-title">
  <div class="wrap">
    ${opener("05", c.kicker.toUpperCase())}
    <div class="studio-hd">
      <h2 class="sec-title serif reveal" id="studio-title">${esc(c.title)}</h2>
      <p class="studio-intro reveal">${esc(c.intro)}</p>
    </div>
    <div class="rooms">${rooms}</div>
  </div>
</section>`;
}

// ---------------------------------------------------------------------------
// Credentials
// ---------------------------------------------------------------------------

function credentialsHtml(inputs) {
  const cr = inputs.credentials;
  const items = cr.items
    .map(
      (it) => `
    <li class="cvl reveal" style="--d:${((items2dummy(it, cr.items) % 4) * 0.05).toFixed(2)}s">
      <a href="${esc(it.verify)}" ${extAttrs(it.verify)} class="cvl-name serif">${esc(it.name)}</a>
      <span class="cvl-issuer cap">${esc(it.issuer)}</span>
      <span class="cvl-year cap">${esc(it.year)}</span>
      <span class="cvl-arr" aria-hidden="true">↗</span>
    </li>`
    )
    .join("");
  function items2dummy(it, arr) {
    return arr.indexOf(it);
  }

  return `
<section id="credentials" class="section credentials" aria-labelledby="cred-title">
  <div class="wrap">
    ${opener("06", cr.kicker.toUpperCase())}
    <div class="cred-grid">
      <div class="cred-count reveal">
        <p class="cred-big serif">${esc(cr.count)}</p>
        <p class="cap cred-count-note">${esc(cr.countNote)}</p>
        <p class="cred-intro">${esc(cr.intro)}</p>
        <a class="lin cred-archive" href="${esc(cr.profileUrl)}" ${extAttrs(cr.profileUrl)}>The full ledger ↗</a>
      </div>
      <ol class="cvl-list">${items}</ol>
    </div>
  </div>
</section>`;
}

// ---------------------------------------------------------------------------
// Journal
// ---------------------------------------------------------------------------

function journalHtml(inputs) {
  const j = inputs.journal;
  const entries = j.entries
    .map((e) => `
  <article class="jrn reveal">
    <div class="jrn-hd">
      <span class="jrn-kind cap">${esc(e.kind)}</span>
      <span class="jrn-date cap">${esc(e.date)}</span>
    </div>
    <h3 class="jrn-title serif">${esc(e.title)}</h3>
    <p class="jrn-body">${esc(e.body)}</p>
    <div class="jrn-tags">${stackList(e.tags)}</div>
  </article>`)
    .join("");

  return `
<section id="journal" class="section journal" aria-labelledby="jrn-title">
  <div class="wrap">
    ${opener("07", j.kicker.toUpperCase())}
    <div class="journal-hd">
      <h2 class="sec-title serif reveal" id="jrn-title">${esc(j.title)}</h2>
      <p class="journal-intro reveal">${esc(j.intro)}</p>
    </div>
    <div class="jrn-grid">${entries}</div>
  </div>
</section>`;
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

function contactHtml(inputs) {
  const c = inputs.contact;
  const p = inputs.person;
  const actions = c.actions
    .map((a, i) => `
  <a class="act reveal" style="--d:${(i * 0.07).toFixed(2)}s" href="${esc(a.href)}" ${extAttrs(a.href)}>
    <span class="act-note cap">${esc(a.note)}</span>
    <span class="act-value serif">${esc(a.value)}<span class="act-arr" aria-hidden="true">→</span></span>
  </a>`)
    .join("");

  return `
<section id="contact" class="section contact" aria-labelledby="contact-title">
  <div class="wrap">
    ${opener("08", c.kicker.toUpperCase())}
    <h2 class="contact-title serif reveal" id="contact-title">${esc(c.title)}<i class="tone" aria-hidden="true">.</i></h2>
    <div class="contact-grid">
      <p class="contact-note reveal">${esc(c.note)}</p>
      <div class="contact-acts">
        ${actions}
        <p class="contact-avail cap reveal"><span class="avail-dot" aria-hidden="true"></span>${esc(p.status)}</p>
      </div>
    </div>
  </div>
</section>`;
}

// ---------------------------------------------------------------------------
// Colophon / footer
// ---------------------------------------------------------------------------

function colophonHtml(inputs) {
  const co = inputs.colophon;
  const p = inputs.person;
  const year = co.year || new Date().getUTCFullYear();
  return `
<footer class="colophon">
  <div class="wrap colophon-in">
    <div class="colophon-top">
      <p class="colophon-name serif">${esc(p.name)}</p>
      <p class="cap colophon-tag">${esc(p.disciplines)}</p>
    </div>
    <p class="cap colophon-line">${esc(co.line)}</p>
    <p class="cap colophon-note">${esc(co.note)}</p>
    <div class="colophon-meta cap">
      <span>© ${esc(String(year))} ${esc(p.name)}</span>
      <span>${esc(inputs.edition)}</span>
      <a class="colophon-top" href="#top">Back to top ↑</a>
    </div>
  </div>
</footer>`;
}

// ---------------------------------------------------------------------------
// Stylesheet
// ---------------------------------------------------------------------------

function css(t, f, s) {
  return `
:root {
  --paper: ${t.paper};
  --paper-deep: ${t.paperDeep};
  --paper-dim: ${t.paperDim};
  --ink: ${t.ink};
  --ink-2: ${t.ink2};
  --ink-3: ${t.ink3};
  --rule: ${t.rule};
  --accent: ${t.accent};
  --accent-deep: ${t.accentDeep};
  --accent-2: ${t.accent2};
  --serif: ${f.display};
  --sans: ${f.sans};
  --mono: ${f.mono};
  --ease: cubic-bezier(.22, 1, .36, 1);
  --edge: clamp(1.25rem, 4vw, 4.5rem);
  --hh: 68px;
  color-scheme: light;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  background: var(--paper);
  background-image: radial-gradient(ellipse 140% 60% at 80% -10%, rgba(226,74,31,.045), transparent 55%);
  color: var(--ink);
  font-family: var(--sans);
  font-size: ${s.body};
  line-height: ${s.bodyLine};
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  overflow-x: clip;
}
::selection { background: var(--accent); color: var(--paper); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

a { color: inherit; text-decoration: none; }
p { margin: 0 0 1em; }
img { max-width: 100%; display: block; }

.cap { font-family: var(--mono); font-size: ${s.cap}; letter-spacing: ${s.capTrack}; text-transform: uppercase; line-height: 1.5; }
.serif { font-family: var(--serif); }
.serif-i { font-family: var(--serif); font-style: italic; font-weight: 460; }
.si { font-family: var(--serif); font-style: italic; font-weight: 460; }
.tone { font-style: normal; color: var(--accent); font-family: inherit; }

.skip {
  position: absolute; left: -999px; top: 0; z-index: 100;
  background: var(--ink); color: var(--paper);
  padding: .8rem 1.2rem; font-family: var(--mono); font-size: .75rem;
}
.skip:focus { left: 1rem; top: 1rem; }

/* ------------------------------------------------------------- wrap + section */
.wrap { max-width: 1280px; margin: 0 auto; padding-inline: var(--edge); position: relative; }
.section { padding-block: clamp(5rem, 11vw, 9rem); position: relative; }
.section:not(:first-of-type) { border-top: 1px solid var(--rule); }

/* ------------------------------------------------------------- opener */
.opener { display: flex; align-items: center; gap: 1.25rem; margin-bottom: clamp(2.5rem, 6vw, 4.5rem); }
.opener-rule { flex: 0 0 clamp(2rem, 8vw, 7rem); height: 1px; background: var(--accent); }
.opener-line { display: flex; align-items: center; gap: 1.1rem; margin: 0; }
.opener-num { font-family: var(--serif); font-size: 1.05rem; color: var(--accent); font-variant-numeric: tabular-nums; }
.opener-label { font-family: var(--mono); font-size: ${s.cap}; letter-spacing: .22em; text-transform: uppercase; color: var(--ink-3); }
.opener-idx { margin: 0 0 0 auto; font-family: var(--mono); font-size: ${s.cap}; letter-spacing: .1em; color: var(--ink-3); }

.sec-title { font-family: var(--serif); font-weight: 560; font-size: ${s.section}; line-height: ${s.sectionLine}; letter-spacing: -.015em; margin: 0 0 clamp(2rem, 5vw, 3.5rem); max-width: 20ch; }

.ghost {
  position: absolute; z-index: 0; pointer-events: none; user-select: none;
  font-family: var(--serif); font-weight: 700; line-height: 1;
  font-size: clamp(8rem, 24vw, 22rem);
  color: transparent; -webkit-text-stroke: 1px var(--paper-dim);
  right: -0.05em; bottom: -.18em; transform: rotate(-4deg);
}

/* ------------------------------------------------------------- nav / headroom */
.nav {
  position: fixed; inset: 0 0 auto 0; z-index: 80;
  background: color-mix(in srgb, var(--paper) 92%, transparent);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid transparent;
  transition: transform .45s var(--ease), border-color .3s;
}
.nav.scrolled { border-bottom-color: var(--rule); }
.nav[data-state="hidden"] { transform: translateY(-101%); }
.nav-in { display: flex; align-items: center; justify-content: space-between; gap: 1rem; height: var(--hh); padding-inline: clamp(1rem, 3vw, 3rem); }
.nav-word { font-family: var(--serif); font-weight: 600; font-size: 1.02rem; letter-spacing: -.01em; white-space: nowrap; }
.nav-word em { font-weight: 460; color: var(--ink-3); }
.nav-mov { display: flex; gap: clamp(1rem, 2.2vw, 2.4rem); }
.nav-mov a { font-family: var(--mono); font-size: .7rem; letter-spacing: .16em; text-transform: uppercase; color: var(--ink-3); position: relative; padding-block: .4rem; }
.nav-mov a::after { content: ""; position: absolute; left: 0; right: 100%; bottom: 0; height: 1px; background: var(--ink); transition: right .35s var(--ease); }
.nav-mov a:hover::after, .nav-mov a.current::after { right: 0; }
.nav-mov a.current { color: var(--ink); }
.nav-tools { display: flex; align-items: center; gap: 1.25rem; }
.nav-ed { color: var(--ink-3); white-space: nowrap; }
.avail-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--accent); margin-right: .5rem; vertical-align: 1px; }
.nav-menu { display: none; background: none; border: 0; cursor: pointer; color: var(--ink); padding: .4rem .2rem; }
.nav-drop { display: none; }

/* ------------------------------------------------------------- hero */
.hero { min-height: 100svh; display: flex; flex-direction: column; padding-top: calc(var(--hh) + clamp(1.5rem, 4vw, 3rem)); position: relative; }
.hero-in { display: grid; grid-template-columns: repeat(12, 1fr); grid-template-rows: auto auto auto; gap: clamp(1.5rem, 3vw, 2.5rem); flex: 1; align-content: start; }
.hero-copy { grid-column: 1 / 8; }
.hero-issue { color: var(--ink-3); margin: 0 0 1.1rem; }
.hero-display { margin: 0; font-family: var(--serif); font-weight: 580; line-height: .99; letter-spacing: -.022em; }
.hero-lines { display: block; }
.hero-l { display: block; }
.hero-l .si { font-style: italic; font-weight: 460; }
.hero-l:first-child { font-size: clamp(3.2rem, 8.2vw, 7.4rem); }
.hero-l:nth-child(2) { font-size: clamp(3.2rem, 8.2vw, 7.4rem); color: var(--ink-2); }
.hero-l:last-child { font-size: clamp(2.6rem, 6.6vw, 6rem); margin-top: .08em; }
.tone { color: var(--accent); font-style: normal; }
.hero-sub-grid { display: grid; grid-template-columns: 1fr .9fr; gap: 2.5rem; margin-top: clamp(1.75rem, 3.5vw, 3rem); padding-top: 1.4rem; border-top: 1px solid var(--rule); }
.hero-sub { margin: 0; color: var(--ink-2); font-size: ${s.lede}; line-height: 1.5; max-width: 44ch; font-weight: 500; }
.hero-idx { margin: 0; color: var(--ink-3); font-size: ${s.body}; line-height: 1.6; max-width: 38ch; }

.hero-figure { grid-column: 9 / 13; grid-row: 1 / 3; justify-self: center; position: relative; }
.portrait-stack { position: relative; transform: rotate(-1.6deg); }
.portrait-ghost {
  position: absolute; top: -1.15em; left: -0.28em; z-index: 0;
  font-family: var(--serif); font-weight: 700; font-size: clamp(5rem, 12vw, 9rem); line-height: 1;
  color: transparent; -webkit-text-stroke: 1.5px var(--paper-dim);
}
.portrait { margin: 0; border: 1px solid var(--ink); padding: .55rem .55rem 1.35rem; background: var(--white, #FBFAF5); position: relative; z-index: 1; box-shadow: .35rem .5rem 0 -0.4rem var(--ink); }
.portrait-img { width: 100%; height: clamp(20rem, 34vw, 30rem); object-fit: cover; filter: saturate(.85) contrast(1.02); }
.portrait-tag { position: absolute; left: -3.6rem; bottom: 2.2rem; z-index: 2; background: var(--paper); color: var(--ink-2); padding: .35rem .7rem; border: 1px solid var(--rule); transform: rotate(-2deg); max-width: 12ch; }
.plate-chip { position: absolute; right: -2.4rem; top: 3.4rem; border: 1px solid var(--accent); color: var(--accent); padding: .3rem .6rem; transform: rotate(3deg); background: var(--paper); }

.hero-margin { grid-column: 1 / 8; display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid var(--ink); margin-top: clamp(1.5rem, 4vw, 2.5rem); }
.margin-cell { padding-top: .9rem; border-right: 1px solid var(--rule); padding-right: 1rem; }
.margin-cell:not(:first-child) { padding-left: 1rem; }
.margin-count { border-right: 0; }
.margin-label { display: block; color: var(--ink-3); margin-bottom: .35rem; }
.margin-value { font-family: var(--sans); font-weight: 600; font-size: .95rem; letter-spacing: .01em; }

.hero-foot { display: flex; justify-content: space-between; gap: 1rem; padding-block: 1.2rem; border-top: 1px solid var(--rule); color: var(--ink-3); margin-top: auto; flex-wrap: wrap; }

/* ------------------------------------------------------------- manifesto */
.man-grid { display: grid; grid-template-columns: 7fr 4fr; gap: clamp(2.5rem, 6vw, 6rem); align-items: start; }
.man-title { font-family: var(--serif); font-weight: 560; font-size: ${s.section}; line-height: 1.05; letter-spacing: -.015em; margin: 0 0 clamp(2rem, 4vw, 3rem); }
.man-body { max-width: 58ch; }
.reel-p { color: var(--ink-2); margin-bottom: 1.35em; }
.reel-lede { font-size: 1.22em; line-height: 1.6; color: var(--ink); font-weight: 460; }
.reel-lede::first-letter {
  font-family: var(--serif); font-size: 3.1em; float: left; line-height: .8;
  padding: .06em .12em 0 0; color: var(--accent); font-style: italic; font-weight: 620;
}
.man-sig { margin-top: 2.5rem; color: var(--ink-3); }
.man-pull { position: sticky; top: calc(var(--hh) + 2rem); }
.man-pull-inner { border-top: 4px double var(--ink); border-bottom: 1px solid var(--ink); padding: 1.6rem 0; position: relative; }
.man-pull-kicker { color: var(--ink-3); display: block; margin-bottom: 1.1rem; }
.man-quote { margin: 0; font-family: var(--serif); font-style: italic; font-weight: 480; font-size: clamp(1.5rem, 2.6vw, 2.1rem); line-height: 1.28; letter-spacing: -.01em; }
.man-pull-ink { position: absolute; right: -.2rem; bottom: -1.15rem; font-size: 1.6rem; color: var(--accent); transform: rotate(-12deg); }

/* ------------------------------------------------------------- work */
.works { display: flex; flex-direction: column; gap: clamp(4rem, 9vw, 8.5rem); }
.proj { position: relative; counter-increment: proj; }
.proj-hd { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; border-top: 1px solid var(--ink); padding-top: 1.1rem; margin-bottom: clamp(1.75rem, 4vw, 2.75rem); }
.proj-hd-l { display: flex; align-items: baseline; gap: 1.1rem; }
.num { font-family: var(--serif); font-style: italic; font-weight: 520; font-size: 1.4rem; color: var(--accent); }
.proj-name { margin: 0; font-size: clamp(1.9rem, 3.6vw, 3rem); font-weight: 560; line-height: 1.05; letter-spacing: -.015em; }
.proj-hd-r { display: flex; align-items: baseline; gap: 1.1rem; white-space: nowrap; }
.proj-k { font-family: var(--serif); font-style: italic; color: var(--ink-3); font-size: .98rem; }
.proj-year { color: var(--ink-3); }

.proj-grid { display: grid; grid-template-columns: 5.5fr 4.5fr; gap: clamp(1.75rem, 4.5vw, 4.5rem); align-items: start; }
.proj-grid.swap { grid-template-columns: 4.5fr 5.5fr; }
.proj-grid.swap .fig { grid-column: 2; grid-row: 1; }
.proj-grid.swap .proj-body { grid-column: 1; grid-row: 1; }

.fig { margin: 0; }
.fig-plate { border: 1px solid var(--ink); background: var(--paper-deep); transform: rotate(-1.1deg); box-shadow: .4rem .6rem 0 var(--paper-dim); }
.fig-img { width: 100%; height: clamp(17rem, 26vw, 23rem); object-fit: cover; filter: saturate(.88); }
.fig .plate-svg, .fig svg { display: block; width: 100%; height: auto; aspect-ratio: 1200 / 820; }
.fig-cap { margin-top: .75rem; color: var(--ink-3); transform: rotate(.4deg); }
.fig-num { color: var(--ink); }

.proj-body { display: flex; flex-direction: column; gap: 1.5rem; }
.proj-lead { margin: 0; font-size: clamp(1.18rem, 2vw, 1.42rem); line-height: 1.5; color: var(--ink); font-weight: 480; letter-spacing: -.01em; }
.meta { margin: 0; border-top: 1px solid var(--rule); }
.meta-row { display: grid; grid-template-columns: 8ch 1fr; gap: 1rem; padding-block: .55rem; border-bottom: 1px solid var(--rule); }
.meta-row dt { color: var(--ink-3); padding-top: .1rem; }
.meta-row dd { margin: 0; font-weight: 600; }
.outcomes { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: .55rem; }
.outcome { position: relative; padding-left: 1.4rem; color: var(--ink-2); }
.outcome::before { content: "→"; position: absolute; left: 0; color: var(--accent); font-family: var(--mono); }
.proj-foot { margin-top: auto; border-top: 1px solid var(--rule); padding-top: 1.1rem; display: flex; flex-direction: column; gap: 1rem; }
.stack { margin: 0; font-family: var(--mono); font-size: .72rem; letter-spacing: .04em; color: var(--ink-3); text-transform: uppercase; }
.stack-sep { margin-inline: .55em; color: var(--accent); }
.proj-links { display: flex; gap: 1.5rem; }
.lin { font-family: var(--mono); font-size: .72rem; letter-spacing: .16em; text-transform: uppercase; color: var(--ink); border-bottom: 1px solid var(--ink); padding-bottom: .15rem; transition: color .25s, border-color .25s; }
.lin:hover { color: var(--accent); border-color: var(--accent); }

/* ------------------------------------------------------------- about */
.about-grid { display: grid; grid-template-columns: 7fr 4fr; gap: clamp(2.5rem, 6vw, 6rem); align-items: start; }
.about-head { font-size: ${s.lede}; line-height: 1.55; color: var(--ink); font-weight: 560; max-width: 46ch; letter-spacing: -.01em; margin-bottom: 2rem; }
.about-body { max-width: 58ch; color: var(--ink-2); }
.about-body p { margin-bottom: 1.35em; }
.about-sign { margin-top: 2.4rem; color: var(--ink-3); }
.fact-panel { border: 1px solid var(--ink); background: var(--paper-deep); padding: 1.6rem 1.6rem 1.2rem; margin-bottom: 1.5rem; }
.panel-kicker { display: block; color: var(--ink-3); margin-bottom: 1.1rem; }
.facts { margin: 0; }
.fact-row { display: grid; grid-template-columns: 1fr; gap: .2rem; padding-block: .7rem; border-top: 1px solid var(--rule); }
.fact-row:last-of-type { border-bottom: 1px solid var(--rule); }
.fact-row dt { color: var(--ink-3); }
.fact-row dd { margin: 0; font-weight: 600; line-height: 1.45; }
.recog-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .7rem; }
.recog-list li { padding-top: .7rem; border-top: 1px solid var(--rule); }
.recog-label { display: block; color: var(--ink-3); }

/* ------------------------------------------------------------- experience */
.exp-list { display: flex; flex-direction: column; }
.exp { display: flex; gap: clamp(1.25rem, 3vw, 3rem); padding-block: clamp(1.6rem, 3.4vw, 2.4rem); border-top: 1px solid var(--rule); }
.exp:last-of-type { border-bottom: 1px solid var(--ink); }
.exp-period { flex: 0 0 11ch; padding-top: .3rem; color: var(--ink-3); }
.exp-main { flex: 1 1 auto; }
.exp-role { margin: 0 0 .3rem; font-weight: 560; font-size: clamp(1.35rem, 2.6vw, 1.9rem); line-height: 1.15; letter-spacing: -.01em; }
.exp-org { color: var(--ink-3); margin-bottom: 1rem; }
.exp-desc { color: var(--ink-2); max-width: 62ch; margin-bottom: 1.1rem; }
.exp-foot { display: flex; flex-wrap: wrap; align-items: baseline; gap: .6rem 1.75rem; }
.exp-note { color: var(--ink-3); font-size: .98rem; }
.exp-tag { flex: 0 0 auto; align-self: flex-end; color: var(--ink-3); }

/* ------------------------------------------------------------- studio */
.studio-hd { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: end; margin-bottom: clamp(2.25rem, 4.5vw, 3.5rem); }
.studio-hd .sec-title { margin: 0; }
.studio-intro { margin: 0; color: var(--ink-3); max-width: 42ch; }
.rooms { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--ink); }
.room { border-bottom: 1px solid var(--rule); padding: clamp(1.6rem, 3vw, 2.4rem); position: relative; }
.room:nth-child(odd) { border-right: 1px solid var(--rule); }
.room-roomie { position: absolute; top: .9rem; right: 1.4rem; font-family: var(--serif); font-style: italic; font-weight: 520; font-size: 1rem; color: var(--accent); }
.room-title { margin: 0 0 .9rem; font-weight: 560; font-size: clamp(1.35rem, 2.4vw, 1.75rem); line-height: 1.15; letter-spacing: -.01em; padding-right: 2ch; }
.room-note { color: var(--ink-2); max-width: 44ch; margin-bottom: 1.4rem; }
.room-items { padding-top: .9rem; border-top: 1px solid var(--rule); }

/* ------------------------------------------------------------- credentials */
.cred-grid { display: grid; grid-template-columns: 4fr 8fr; gap: clamp(2.5rem, 6vw, 6rem); align-items: start; }
.cred-count { position: sticky; top: calc(var(--hh) + 2rem); }
.cred-big { margin: 0 0 .2rem; font-size: clamp(6rem, 14vw, 11rem); line-height: .84; font-weight: 640; letter-spacing: -.03em; }
.cred-big::after { content: "×"; font-size: .5em; color: var(--accent); vertical-align: super; margin-left: .08em; }
.cred-count-note { color: var(--ink-3); margin-bottom: 1.6rem; }
.cred-intro { color: var(--ink-2); max-width: 36ch; margin-bottom: 1.6rem; }
.cred-archive { display: inline-block; }
.cvl-list { list-style: none; margin: 0; padding: 0; counter-reset: cv; display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--ink); }
.cvl { display: flex; flex-direction: column; gap: .25rem; padding: 1.1rem 1.3rem 1.1rem 0; border-bottom: 1px solid var(--rule); position: relative; margin-right: 1.3rem; }
.cvl:nth-child(2n) { border-left: 1px solid var(--rule); padding-left: 1.3rem; margin-right: 0; }
.cvl::before { counter-increment: cv; content: counter(cv, decimal-leading-zero); font-family: var(--mono); font-size: .66rem; letter-spacing: .1em; color: var(--ink-3); margin-bottom: .2rem; }
.cvl-name { font-weight: 560; font-size: 1.02rem; line-height: 1.25; padding-right: 1.2em; }
.cvl-name:hover { color: var(--accent); }
.cvl-issuer, .cvl-year { color: var(--ink-3); }
.cvl-arr { position: absolute; right: .4rem; top: 1.15rem; color: var(--accent); }

/* ------------------------------------------------------------- journal */
.journal-hd { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: end; margin-bottom: clamp(2.25rem, 4.5vw, 3.5rem); }
.journal-hd .sec-title { margin: 0; }
.journal-intro { margin: 0; color: var(--ink-3); max-width: 42ch; }
.jrn-grid { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--ink); gap: 0; }
.jrn { border-bottom: 1px solid var(--rule); padding: clamp(1.6rem, 3vw, 2.3rem); }
.jrn:nth-child(odd) { border-right: 1px solid var(--rule); }
.jrn-hd { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1rem; }
.jrn-kind { color: var(--accent); }
.jrn-date { color: var(--ink-3); }
.jrn-title { margin: 0 0 .9rem; font-weight: 560; font-size: clamp(1.3rem, 2.3vw, 1.7rem); line-height: 1.2; letter-spacing: -.01em; }
.jrn-body { color: var(--ink-2); max-width: 48ch; }
.jrn-tags { margin-top: 1.3rem; padding-top: .9rem; border-top: 1px solid var(--rule); }

/* ------------------------------------------------------------- contact */
.contact-title { font-family: var(--serif); font-weight: 600; font-size: clamp(3rem, 8.5vw, 7.5rem); line-height: .98; letter-spacing: -.03em; margin: 0 0 clamp(2rem, 5vw, 4rem); max-width: 14ch; }
.contact-grid { display: grid; grid-template-columns: 5fr 7fr; gap: clamp(2.5rem, 6vw, 6rem); align-items: start; }
.contact-note { color: var(--ink-2); max-width: 44ch; font-size: 1.12em; line-height: 1.6; }
.contact-acts { display: flex; flex-direction: column; }
.act { display: flex; flex-direction: column; gap: .1rem; padding-block: 1.4rem; border-top: 1px solid var(--rule); transition: border-color .3s; }
.act:last-of-type { border-bottom: 1px solid var(--ink); }
.act:hover { border-top-color: var(--accent); }
.act:hover .act-value { color: var(--accent); }
.act-note { color: var(--ink-3); }
.act-value { font-family: var(--serif); font-weight: 540; font-size: clamp(1.4rem, 3vw, 2.2rem); letter-spacing: -.01em; display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; transition: color .3s; }
.act-arr { font-family: var(--sans); font-weight: 600; font-size: 1.1em; }
.act:hover .act-arr { transform: translateX(.35rem); }
.act-arr { display: inline-block; transition: transform .35s var(--ease); }
.contact-avail { margin: 1.8rem 0 0; color: var(--ink-3); }

/* ------------------------------------------------------------- colophon */
.colophon { border-top: 1px solid var(--ink); background: var(--ink); color: var(--paper); margin-top: clamp(2rem, 4vw, 4rem); }
.colophon-in { padding-block: clamp(2.5rem, 5vw, 3.5rem); display: flex; flex-direction: column; gap: 1rem; }
.colophon-top { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; border-bottom: 1px solid rgba(244,240,230,.28); padding-bottom: 1.4rem; margin-bottom: .6rem; }
.colophon-name { font-weight: 600; font-size: clamp(1.6rem, 3vw, 2.4rem); margin: 0; letter-spacing: -.01em; }
.colophon-tag { color: var(--paper-dim); }
.colophon-line, .colophon-note { color: var(--paper-dim); margin: 0; }
.colophon-meta { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; border-top: 1px solid rgba(244,240,230,.28); padding-top: 1.4rem; color: var(--paper-dim); }
.colophon-top a, .colophon-meta a { color: inherit; }
.colophon-top a:hover, .colophon-meta a:hover { color: var(--accent); }

/* ------------------------------------------------------------- motion */
.reveal { opacity: 0; transform: translateY(26px); transition: opacity .8s var(--ease), transform .8s var(--ease); transition-delay: var(--d, 0s); }
.reveal.in { opacity: 1; transform: none; }
.reveal-g { transition-delay: 0s; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal { opacity: 1; transform: none; transition: none; }
  .act-arr, .lin, .cvl-name, .act-value { transition: none; }
}

/* ------------------------------------------------------------- responsive */
@media (max-width: 960px) {
  .nav-mov { display: none; }
  .nav-menu { display: block; }
  .nav-drop { position: absolute; top: var(--hh); left: 0; right: 0; background: var(--paper); border-bottom: 1px solid var(--rule); padding: .5rem 1rem 1rem; flex-direction: column; gap: .2rem; }
  .nav-drop a { display: block; padding: .8rem; font-family: var(--mono); font-size: .75rem; letter-spacing: .16em; text-transform: uppercase; border-top: 1px solid var(--rule); }
  .hero-copy, .hero-idx { grid-column: 1 / -1; }
  .hero-sub-grid { grid-template-columns: 1fr; gap: 1.25rem; }
  .hero-figure { grid-column: 1 / -1; grid-row: auto; justify-self: start; }
  .portrait-img { height: clamp(16rem, 60vw, 22rem); }
  .man-grid, .about-grid, .cred-grid { grid-template-columns: 1fr; }
  .man-pull { position: static; }
  .cred-count { position: static; }
  .proj-grid, .proj-grid.swap { grid-template-columns: 1fr; }
  .proj-grid.swap .fig { grid-column: 1; grid-row: auto; }
  .proj-grid.swap .proj-body { grid-column: 1; grid-row: auto; }
  .rooms, .jrn-grid { grid-template-columns: 1fr; }
  .room:nth-child(odd) { border-right: 0; }
  .jrn:nth-child(odd) { border-right: 0; }
  .studio-hd, .journal-hd, .contact-grid { grid-template-columns: 1fr; gap: 1.4rem; }
  .hero-margin { grid-template-columns: 1fr 1fr; row-gap: 1.4rem; }
  .margin-cell:nth-child(2) { border-right: 0; }
}

@media (max-width: 560px) {
  :root { --hh: 60px; }
  .nav-ed { display: none; }
  .exp { flex-direction: column; gap: .75rem; }
  .exp-tag { display: none; }
  .cvl-list { grid-template-columns: 1fr; }
  .cvl:nth-child(2n) { border-left: 0; padding-left: 0; }
  .hero-l:first-child, .hero-l:nth-child(2) { font-size: clamp(2.6rem, 12.5vw, 4rem); }
  .hero-l:last-child { font-size: clamp(2.1rem, 10.5vw, 3.4rem); }
  .portrait-tag { left: -.8rem; }
  .contact-title { font-size: clamp(2.6rem, 13vw, 4rem); }
  .hero-margin { grid-template-columns: 1fr; }
  .margin-cell { border-right: 0; }
  .section { padding-block: 4.5rem; }
}`;
  return cssScript + "";
}

// ---------------------------------------------------------------------------
// Client script — plain ES5-friendly JS (no template syntax, safe to inline).
// Scroll reveal + active-nav + headroom masthead + mobile menu + year.
// ---------------------------------------------------------------------------

const CLIENT_JS = `
(function () {
  "use strict";
  var nav = document.getElementById("masthead");
  var menuBtn = document.getElementById("nav-toggle");
  var drop = document.getElementById("nav-drop");
  var lastY = window.scrollY || 0;
  var shown = true;

  function clamp(n) { return n < 0 ? 0 : n; }

  window.addEventListener("scroll", function () {
    var y = clamp(window.scrollY || 0);
    var scrollingDown = y > lastY + 6;
    var scrollingUp = lastY > y + 6;
    var state = nav.getAttribute("data-state") || "";

    if (y > 140) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }

    if (scrollingDown && y > 220 && !shown) { /* already hidden */ }
    if (scrollingDown && y > 220) {
      nav.setAttribute("data-state", "hidden");
      shown = false;
    } else if ((scrollingUp || y <= 220) && !shown) {
      nav.setAttribute("data-state", "shown");
      shown = true;
    }

    /* snap-close the mobile menu when the masthead hides */
    if (menuBtn && drop && !drop.hidden && scrollingDown) {
      closeMenu();
    }
    lastY = y;
  }, { passive: true });

  function closeMenu() {
    drop.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
  }
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = drop.hidden;
      drop.hidden = !open;
      menuBtn.setAttribute("aria-expanded", String(open));
    });
  }

  /* Scroll reveal — one IntersectionObserver, respects reduced motion. */
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    for (var r = 0; r < revealEls.length; r++) { revealEls[r].classList.add("in"); }
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    for (var i = 0; i < revealEls.length; i++) { io.observe(revealEls[i]); }
  }

  /* Active section in the masthead. */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  if (navLinks.length && "IntersectionObserver" in window) {
    var map = {};
    navLinks.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      if (!map[id]) { map[id] = []; }
      map[id].push(a);
    });
    var ao = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.getAttribute("id");
        if (map[id]) {
          map[id].forEach(function (a) {
            if (entry.isIntersecting) { a.classList.add("current"); }
            else { a.classList.remove("current"); }
          });
        }
      });
    }, { threshold: 0.35 });
    var secs = document.querySelectorAll("main section[id]");
    for (var s = 0; s < secs.length; s++) { ao.observe(secs[s]); }
  }

  /* Anchor offset respects the fixed masthead. */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function () {
      closeMenu();
    });
  });
})();
`;

// ---------------------------------------------------------------------------
// Document assembly — the pure compose root.
// ---------------------------------------------------------------------------

export function compose(inputs, ctx = {}) {
  const c = Object.assign({ fonts, scale, tokenDefaults: tokens }, ctx);
  const t = c.tokenDefaults || tokens;

  const favicon =
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#F4F0E6"/><rect x="8" y="8" width="48" height="48" fill="none" stroke="#17150F"/><text x="32" y="41" font-family="Georgia,serif" font-size="24" font-style="italic" text-anchor="middle" fill="#E24A1F">S</text></svg>`
    );

  const title = `${inputs.person.name} — ${inputs.person.role}`;
  const year = inputs.colophon.year || new Date().getUTCFullYear();

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(title)}</title>
<meta name="description" content="${esc(inputs.person.indexLine)}"/>
<meta name="theme-color" content="${t.paper}"/>
<meta property="og:title" content="${esc(inputs.person.name)} — ${esc(inputs.edition)}"/>
<meta property="og:description" content="${esc(inputs.person.indexLine)}"/>
<meta property="og:type" content="website"/>
<link rel="icon" href="${favicon}"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Archivo:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
<style>
${css(t, fonts, scale)}
</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${navHtml(inputs)}
<div class="page">
<main id="main">
${heroHtml(inputs, c)}
${manifestoHtml(inputs)}
${workHtml(inputs, c)}
${aboutHtml(inputs)}
${experienceHtml(inputs)}
${capabilitiesHtml(inputs)}
${credentialsHtml(inputs)}
${journalHtml(inputs)}
${contactHtml(inputs)}
</main>
${colophonHtml(inputs)}
</div>
<script>
${CLIENT_JS}
</script>
</body>
</html>
`;
}