// Site-level constants. Anything the nav, the command palette, and the meta
// tags all need to agree on lives here so they cannot drift apart.

/**
 * The canonical origin.
 *
 * Matches the `CNAME` at the repo root (GitHub Pages). Kept as a constant
 * because three different things need it — the canonical link, the Open Graph
 * URL, and the JSON-LD `url`/`sameAs` — and a hand-typed absolute URL in three
 * places is three chances to ship a link preview pointing somewhere else.
 */
export const ORIGIN = 'https://santhosh_sunkara_portifolio.com';

/**
 * Share-card and search copy.
 *
 * Kept beside the identity block rather than in index.html so the rendered
 * <title>/description and the JSON-LD are generated from one source. index.html
 * reads these back at build time via the metaHtml plugin in vite.config.js —
 * which is the only way the "cannot drift apart" claim at the top of this file
 * is actually true.
 */
export const META = {
  title: 'Santhosh Sunkara — Applied ML Engineer',
  description:
    'Applied ML engineer building vision and language systems that survive production: a fire-detection service that confirms before it alerts, a PPO agent that grades its own runs, and sign-language input turned into speech.',
  /** Absolute path to the 1200x630 share card. Must start with a slash. */
  image: '/og.png',
  /** 'website' for a single-page portfolio; 'profile' is not a valid OG type. */
  type: 'website',
  locale: 'en_US',
};

export const SITE = {
  name: 'Santhosh Sunkara',
  brandmark: 'SS',
  role: 'Applied ML Engineer',
  status: 'Available for roles',
  location: 'Kakinada, Andhra Pradesh',
  timeZone: 'Asia/Kolkata',
  timezoneLabel: 'IST',
  email: 'santhoshsunkarasbe@gmail.com',
  github: 'https://github.com/santhosh220z',
  linkedin:
    'https://www.linkedin.com/in/siva-sambhavi-santhosh-sunkara-588a24265/',
  // The PDF in `public/`, which Vite copies to the site root verbatim. Held
  // here rather than inlined at each call site so the hero, the bar, the footer
  // and the command palette cannot drift onto different paths — and so swapping
  // in a new `public/resume.pdf` needs no code change at all.
  resume: '/resume.pdf',
};

/**
 * The four anchors in the status bar, in the order they appear. Deeper
 * sections (experience, education, certifications) are reachable from the
 * command palette but stay off the bar: eight links in a 56px strip is not a
 * status bar, it is a table of contents.
 */
export const NAV_LINKS = [
  { label: 'Work', href: '#work', id: 'work', group: 'Sections' },
  { label: 'Architecture', href: '#architecture', id: 'architecture', group: 'Sections' },
  { label: 'About', href: '#about', id: 'about', group: 'Sections' },
  { label: 'Contact', href: '#contact', id: 'contact', group: 'Sections' },
];

/**
 * Every navigable target, for the command palette. Includes the sub-sections
 * the bar omits, plus the outbound destinations worth one keystroke.
 *
 * The skill ledger deliberately has no entry of its own: it now lives inside
 * #architecture rather than in a separate section, and a palette item that
 * scrolled to the top of a neighbouring block would be a worse link than none.
 */
export const COMMAND_INDEX = [
  ...NAV_LINKS,
  { label: 'Experience', href: '#experience', id: 'experience', group: 'Sections' },
  { label: 'Education', href: '#education', id: 'education', group: 'Sections' },
  { label: 'Certifications', href: '#certifications', id: 'certifications', group: 'Sections' },
  { label: 'GitHub', href: SITE.github, group: 'Elsewhere', external: true },
  { label: 'LinkedIn', href: SITE.linkedin, group: 'Elsewhere', external: true },
  { label: 'Email', href: `mailto:${SITE.email}`, group: 'Elsewhere', external: true },
  { label: 'Résumé (PDF)', href: SITE.resume, group: 'Elsewhere', download: true },
];
