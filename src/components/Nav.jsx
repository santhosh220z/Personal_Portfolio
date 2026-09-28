import React, { useRef } from 'react';
import { Command, Moon, Sun } from 'lucide-react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useLocalTime } from '../lib/hooks';
import { NAV_LINKS, SITE } from '../data/site';
import ThemeToggle from './ThemeToggle';

const Availability = () => (
  <span className="hidden items-center gap-2 sm:flex">
    <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
      {/* The halo is a separate element so the pulse expands outward instead
          of the dot itself growing, which would read as a size change. */}
      <span className="availability-ping absolute inline-flex h-full w-full rounded-full bg-accent" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
    </span>
    <span className="meta meta-accent">{SITE.status}</span>
  </span>
);

const Nav = ({ onOpenCommand }) => {
  const barRef = useRef(null);
  const time = useLocalTime(SITE.timeZone);

  // The bar sheds its height and gains contrast once you leave the hero, so it
  // stops competing with the headline it is sitting on top of.
  //
  // A data attribute rather than a scrubbed CSS variable: the transition is a
  // discrete state change, so animating a custom property per frame would cost
  // a style recalculation on every scroll tick to produce a value CSS could
  // have interpolated on its own.
  React.useEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;

    const context = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top top-=72',
        end: 'max',
        onToggle: (self) => {
          // setAttribute/removeAttribute, not toggleAttribute. toggleAttribute
          // adds the attribute with an empty value when forced on, so the bar
          // would end up as data-scrolled="" and the CSS selector
          // [data-scrolled='true'] would never match — the committed surface
          // silently never applied, leaving the bar transparent over the whole
          // page. Absence of the attribute is the transparent base state.
          if (self.isActive) bar.setAttribute('data-scrolled', 'true');
          else bar.removeAttribute('data-scrolled');
        },
      });
    }, bar);

    return () => context.revert();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[120]">
      <div ref={barRef} className="nav-bar">
        <div className="shell flex h-16 items-center justify-between gap-4">
          {/* Brandmark. min-h is not decoration: as a plain flex item this
              collapsed to its 20px line box, which is under the WCAG 2.2 AA
              24px minimum pointer-target size. 2.75rem comfortably clears it
              and still fits inside the bar's h-16. */}
          <a
            href="#hero"
            className="group flex min-h-[2.75rem] shrink-0 items-center gap-3"
            aria-label={`${SITE.name} — top of page`}
          >
            <span className="font-mono text-sm font-medium tracking-[0.22em] text-fg-1 transition-colors group-hover:text-accent">
              {SITE.brandmark}
              <span className="text-accent">.</span>
            </span>
            <span className="hidden h-3 w-px bg-rule md:block" aria-hidden="true" />
            <Availability />
          </a>

          {/* Anchors */}
          <nav aria-label="Sections" className="hidden md:block">
            <ul className="flex items-center gap-1 list-none p-0">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="meta inline-flex h-11 items-center px-3 transition-colors hover:text-fg-1 focus-visible:text-fg-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Utilities */}
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2 border-r border-rule pr-3 lg:flex">
              <span className="meta">Local</span>
              <time
                dateTime={new Date().toISOString()}
                className="font-mono text-meta tracking-[0.12em] tabular-nums text-fg-2"
              >
                {time}
                <span className="ml-1.5 text-fg-2">{SITE.timezoneLabel}</span>
              </time>
            </div>

            <button
              type="button"
              onClick={onOpenCommand}
              aria-label="Open command palette"
              className="hidden h-11 items-center gap-2 rounded-full border border-rule px-3 transition-colors hover:border-fg-1 sm:inline-flex"
            >
              <Command size={14} className="text-fg-2" aria-hidden="true" />
              <span className="meta">K</span>
            </button>

            <ThemeToggle />
          </div>
        </div>

        {/* Mobile anchor rail. A disclosure would hide navigation behind a tap
            on a portfolio whose whole point is that the work is the pitch. */}
        <nav
          aria-label="Sections, compact"
          className="shell flex items-center gap-1 overflow-x-auto border-t border-rule py-1.5 md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="meta min-h-[2.75rem] shrink-0 px-2 py-2.5 transition-colors hover:text-fg-1"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Nav;
