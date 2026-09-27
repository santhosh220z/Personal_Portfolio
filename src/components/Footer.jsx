import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { SITE } from '../data/site';
import Marquee from './Marquee';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-rule">
      {/* A slow marquee of the site's own vocabulary. Closes the page on the
          same rhythm it opened with. */}
      <div
        aria-hidden="true"
        className="pointer-events-none border-b border-rule py-6 opacity-[0.1] select-none"
      >
        <Marquee
          items={['Engineering', 'Intelligence', 'Motion', 'Architecture']}
          duration={40}
          itemClassName="marquee-giant stroke-type stroke-type-thick px-[0.06em]"
        />
      </div>

      <div className="shell py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <span className="font-mono text-sm tracking-[0.22em] text-fg-1">
              {SITE.brandmark}
              <span className="text-accent">.</span>
            </span>
            <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-fg-2">
              {SITE.role} — {SITE.location}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="icon-btn"
            >
              <Github size={18} aria-hidden="true" />
            </a>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="icon-btn"
            >
              <Linkedin size={18} aria-hidden="true" />
            </a>
            <a href={`mailto:${SITE.email}`} aria-label="Email" className="icon-btn">
              <Mail size={18} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-rule pt-6 md:flex-row md:items-center">
          <p className="meta">© {year} {SITE.name}</p>
          <p className="meta">
            Built with React, GSAP &amp; Tailwind — type set in Syne
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
