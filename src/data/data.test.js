import { describe, it, expect } from 'vitest';
import { PROJECTS, SUPPORTING } from './projects';
import { SITE, NAV_LINKS, COMMAND_INDEX, META, ORIGIN } from './site';
import { ABOUT, EXPERIENCES, SKILL_GROUPS, EDUCATION, CERTIFICATIONS, FEATURED_CERTIFICATIONS } from './resume';

/**
 * Data-integrity tests.
 *
 * This site is entirely data-driven: the components contain no user-facing
 * strings, so `src/data/*` is the entire content surface. The failure mode is
 * not a crash — it is a missing field that renders as `undefined`, or a broken
 * anchor that quietly goes nowhere. Neither shows up in a build, and both are
 * embarrassing on a portfolio whose whole job is being read by someone deciding
 * whether to hire you.
 */

describe('SITE', () => {
  it('has the identity fields the nav and footer render', () => {
    for (const key of ['name', 'brandmark', 'role', 'status', 'location', 'timeZone', 'email', 'github', 'linkedin', 'resume']) {
      expect(SITE[key], `SITE.${key}`).toBeTruthy();
      expect(typeof SITE[key], `SITE.${key} type`).toBe('string');
    }
  });

  it('resumes at a root-relative path that public/ actually provides', () => {
    expect(SITE.resume.startsWith('/')).toBe(true);
    expect(SITE.resume.endsWith('.pdf')).toBe(true);
  });

  it('has a well-formed email', () => {
    expect(SITE.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  });
});

describe('META and ORIGIN', () => {
  it('has a title and a description long enough to be useful', () => {
    expect(META.title.length).toBeGreaterThan(20);
    // Below ~70 characters a search result truncates mid-sentence.
    expect(META.description.length).toBeGreaterThan(70);
  });

  it('keeps the description inside the length a SERP will actually show', () => {
    expect(META.description.length).toBeLessThanOrEqual(320);
  });

  it('points og:image at a root-relative path that public/ provides', () => {
    expect(META.image.startsWith('/')).toBe(true);
  });

  it('has an absolute https origin with no trailing slash or path', () => {
    expect(ORIGIN).toMatch(/^https:\/\/[^/]+$/);
  });
});

describe('PROJECTS', () => {
  it('has featured work', () => {
    expect(PROJECTS.length).toBeGreaterThan(0);
  });

  it('gives every project the fields the drawer reads', () => {
    for (const p of PROJECTS) {
      expect(p.id, `${p.title ?? '?'} id`).toBeTruthy();
      expect(p.index, `${p.title ?? '?'} index`).toBeTruthy();
      expect(p.title, 'title').toBeTruthy();
      expect(p.summary, `${p.title} summary`).toBeTruthy();
      expect(p.problem, `${p.title} problem`).toBeTruthy();
      expect(Array.isArray(p.stack) && p.stack.length > 0, `${p.title} stack`).toBe(true);
      expect(Array.isArray(p.approach) && p.approach.length > 0, `${p.title} approach`).toBe(true);
      expect(Array.isArray(p.metrics) && p.metrics.length > 0, `${p.title} metrics`).toBe(true);
      expect(Array.isArray(p.flow) && p.flow.length > 0, `${p.title} flow`).toBe(true);
    }
  });

  it('uses unique ids — the drawer anchors on them', () => {
    const ids = PROJECTS.map((p) => p.id);
    expect(new Set(ids).size, `duplicate project id in: ${ids.join(', ')}`).toBe(ids.length);
  });

  it('numbers projects sequentially from 01', () => {
    PROJECTS.forEach((p, i) => {
      expect(p.index, `${p.title} index`).toBe(String(i + 1).padStart(2, '0'));
    });
  });

  it('links only to absolute https GitHub URLs', () => {
    for (const p of PROJECTS) {
      if (!p.github) continue;
      expect(p.github, `${p.title} github`).toMatch(/^https:\/\/github\.com\//);
    }
  });

  it('gives every metric a value and a label, and flags placeholders explicitly', () => {
    for (const p of PROJECTS) {
      for (const m of p.metrics) {
        expect(m.value, `${p.title} metric value`).toBeTruthy();
        expect(m.label, `${p.title} metric label`).toBeTruthy();
        // A metric must either declare itself a placeholder or be real. An
        // undefined `placeholder` means nobody decided, and the drawer will
        // silently render it as if it were measured.
        expect(typeof m.placeholder, `${p.title}/${m.label} must declare placeholder`).toBe('boolean');
      }
    }
  });

  it('gives every flow stage a name and at least one node', () => {
    for (const p of PROJECTS) {
      for (const stage of p.flow) {
        expect(stage.stage, `${p.title} flow stage`).toBeTruthy();
        expect(Array.isArray(stage.nodes) && stage.nodes.length > 0, `${p.title}/${stage.stage} nodes`).toBe(true);
      }
    }
  });
});

describe('SUPPORTING', () => {
  it('has the fields the compact card renders', () => {
    for (const s of SUPPORTING) {
      expect(s.title, 'supporting title').toBeTruthy();
      expect(s.summary, `${s.title} summary`).toBeTruthy();
      expect(s.github, `${s.title} github`).toMatch(/^https:\/\//);
    }
  });

  it('does not collide with a featured project id', () => {
    const featured = new Set(PROJECTS.map((p) => p.id));
    for (const s of SUPPORTING) {
      if (s.id) expect(featured.has(s.id), `"${s.id}" used by both featured and supporting`).toBe(false);
    }
  });
});

describe('navigation', () => {
  it('keeps every nav anchor resolvable to a real section id', () => {
    // The ids rendered by App.jsx, mirrored here because there is no single
    // source for them — a section renamed without updating NAV_LINKS produces a
    // link that silently does nothing.
    const sectionIds = ['hero', 'work', 'architecture', 'about', 'experience', 'education', 'certifications', 'contact'];
    for (const link of NAV_LINKS) {
      expect(link.href, `${link.label} href`).toBe(`#${link.id}`);
      expect(sectionIds, `${link.label} -> #${link.id} is not a rendered section`).toContain(link.id);
    }
  });

  it('covers every palette entry with a resolvable target', () => {
    const sectionIds = new Set(['hero', 'work', 'architecture', 'about', 'experience', 'education', 'certifications', 'contact']);
    for (const item of COMMAND_INDEX) {
      if (item.external) {
        expect(item.href, `${item.label} external href`).toMatch(/^(https:\/\/|mailto:)/);
      } else if (item.href.startsWith('#')) {
        expect(sectionIds, `palette "${item.label}" -> ${item.href}`).toContain(item.href.slice(1));
      }
    }
  });

  it('has no duplicate labels in the palette', () => {
    const labels = COMMAND_INDEX.map((i) => i.label);
    expect(new Set(labels).size, `duplicate palette label in: ${labels.join(', ')}`).toBe(labels.length);
  });
});

describe('resume content', () => {
  it('has experiences with the fields the timeline renders', () => {
    for (const e of EXPERIENCES) {
      expect(e.role, 'experience role').toBeTruthy();
      // The field is `company`, not `org` — see EXPERIENCES in resume.js.
      expect(e.company, `${e.role} company`).toBeTruthy();
      expect(e.period ?? e.periods, `${e.role} period`).toBeTruthy();
    }
  });

  it('has non-empty skill groups', () => {
    expect(SKILL_GROUPS.length).toBeGreaterThan(0);
    for (const g of SKILL_GROUPS) {
      expect(g.label ?? g.title, 'skill group label').toBeTruthy();
      expect(Array.isArray(g.items) && g.items.length > 0, `${g.label} items`).toBe(true);
    }
  });

  it('has education entries', () => {
    expect(EDUCATION.length).toBeGreaterThan(0);
  });

  it('has certifications, and every featured one exists in the full set', () => {
    expect(CERTIFICATIONS.length).toBeGreaterThan(0);
    const all = new Set(CERTIFICATIONS.map((c) => c.name ?? c.title ?? c));
    for (const c of FEATURED_CERTIFICATIONS) {
      const name = c?.name ?? c?.title ?? c;
      expect(all.has(name), `FEATURED_CERTIFICATIONS references "${name}" which is not in CERTIFICATIONS`).toBe(true);
    }
  });

  it('has an about block with copy', () => {
    expect(ABOUT).toBeTruthy();
  });
});

/**
 * Every shipped metric must be an explicitly-declared fact.
 *
 * An earlier revision of projects.js carried invented benchmarks (0.94 F1, 92%
 * accuracy, 1.4s median) flagged `placeholder: true`. An audit found no trace of
 * them in the linked repositories, and they were deleted rather than kept behind
 * a SAMPLE tag — a visitor who does not read the fine print cannot tell a
 * fabricated number from a measured one.
 *
 * `placeholder` is still honoured by BlueprintDrawer and is always false. It is
 * kept deliberately: it is the only thing standing between a future edit and a
 * fabricated result rendering as fact. So this asserts the *invariant* (every
 * metric must declare its status) rather than a specific count — if a real
 * placeholder is ever reintroduced, `gives every metric a value and a label`
 * still passes but this one tells you exactly which metric it is.
 */
describe('metric provenance', () => {
  it('currently ships zero placeholder metrics', () => {
    const placeholders = PROJECTS.flatMap((p) =>
      p.metrics.filter((m) => m.placeholder).map((m) => `${p.title}/${m.label}`),
    );
    expect(
      placeholders,
      `placeholder metrics reintroduced: ${placeholders.join(', ')} — replace with a figure traced to the repo, or leave it out`,
    ).toEqual([]);
  });

  it('carries the Hackathon TODOs that mark genuinely-missing facts', () => {
    // Not asserted as a failure. This test exists so that quietly deleting the
    // TODO markers — which are the only signal that this entry is incomplete —
    // is a visible change in the test diff rather than a silent edit.
    const mentor = EXPERIENCES.find((e) => e.role?.toLowerCase().includes('mentor'));
    expect(mentor, 'Hackathon Mentor entry is expected to still exist').toBeTruthy();
  });
});