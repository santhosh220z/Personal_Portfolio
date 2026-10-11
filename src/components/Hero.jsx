import React, { useCallback, useRef, useState } from 'react';
import { ArrowUpRight, Award, Check, Copy, Download } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';
import { GSAP_EASE_SOFT, GSAP_EASE_EXPO } from '../lib/motion';
import { SITE } from '../data/site';
import SubjectAsset from './SubjectAsset';
import ScrubHeadline from './kinetic/ScrubHeadline';
import Magnetic from './kinetic/Magnetic';
import profileImg from '../assets/profile3.webp';


/**
 * Copy-to-clipboard with a state the user can actually perceive.
 *
 * The async Clipboard API is unavailable on insecure origins and throws in some
 * embedded webviews, so a `document.execCommand` path is kept as a fallback —
 * deprecated, but it is the only thing that works when the API does not.
 */
const useCopy = (value, resetAfter = 2000) => {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef(0);

  const copy = useCallback(async () => {
    window.clearTimeout(timer.current);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const scratch = document.createElement('textarea');
        scratch.value = value;
        scratch.setAttribute('readonly', '');
        scratch.style.position = 'fixed';
        scratch.style.opacity = '0';
        document.body.appendChild(scratch);
        scratch.select();
        const ok = document.execCommand('copy');
        scratch.remove();
        if (!ok) throw new Error('execCommand copy rejected');
      }
      setCopied(true);
      setFailed(false);
    } catch {
      setCopied(false);
      setFailed(true);
    }
    timer.current = window.setTimeout(() => {
      setCopied(false);
      setFailed(false);
    }, resetAfter);
  }, [value, resetAfter]);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  return { copied, failed, copy };
};

const Hero = () => {
  const sectionRef = useRef(null);
  const reduceMotion = usePrefersReducedMotion();
  const { copied, failed, copy } = useCopy(SITE.email);

  // Entrance: the hero furniture rises around the headline. The headline's own
  // two-beat entrance lives in ScrubHeadline, which owns those elements.
  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    if (reduceMotion) {
      gsap.set('[data-hero-reveal]', { opacity: 1, y: 0 });
      return undefined;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ delay: 0.15 });
      timeline
        .fromTo(
          '[data-hero-reveal="eyebrow"]',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: GSAP_EASE_SOFT },
        )
        .fromTo(
          '[data-hero-reveal="body"]',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: GSAP_EASE_SOFT },
          '-=0.25',
        )
        .fromTo(
          '[data-hero-reveal="actions"]',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: GSAP_EASE_SOFT },
          '-=0.45',
        )
        .fromTo(
          '[data-hero-reveal="credential"]',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: GSAP_EASE_SOFT },
          '-=0.4',
        )
        .fromTo(
          '[data-hero-reveal="subject"]',
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1, duration: 0.9, ease: GSAP_EASE_EXPO },
          '-=0.8',
        );
    }, section);

    return () => context.revert();
  }, [reduceMotion]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      // pt-32 on mobile clears the status bar *including* its compact anchor
      // rail (64px bar + ~44px rail = ~108px). At pt-24 the eyebrow sat under
      // the rail. md:pt-28 is enough because the rail is hidden from md up.
      className="relative flex min-h-[100dvh] items-center overflow-hidden pt-32 pb-14 md:pt-28 md:pb-20"
    >
      {/* Hairline grid, for structure on an otherwise empty canvas. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--rule) 1px, transparent 1px), linear-gradient(to bottom, var(--rule) 1px, transparent 1px)',
          backgroundSize: '8.333% 100%, 100% 25%',
        }}
      />


      {/* ── Layer 1: content ────────────────────────────────────────────── */}
      <div className="shell relative z-10">
        {/* The eyebrow is a rail rather than a floating line: full shell width,
            hairline under it, and a right-hand marker to close the measure.
            Previously role and location sat as loose type in the top-left with
            nothing on the other side, which left the top of the hero reading as
            an accidental margin rather than a deliberate edge. */}
        <div
          data-hero-reveal="eyebrow"
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-rule pb-3"
        >
          <span className="flex items-center gap-4">
            <span className="meta meta-accent">{SITE.role}</span>
            <span className="hidden h-3 w-px bg-rule sm:block" aria-hidden="true" />
            <span className="meta">{SITE.location}</span>
          </span>
          <span className="meta hidden lg:inline">Portfolio — Vol. 01</span>
        </div>

        {/* 2-column layout: Left = Headline + Copy + CTAs; Right = Prominent Image */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:items-center lg:gap-12 xl:gap-16">
          <div className="flex flex-col">
            <ScrubHeadline />

            <div className="mt-7 lg:mt-9">
              <p
                data-hero-reveal="body"
                className="max-w-[54ch] text-balance text-[length:var(--text-lede)] leading-relaxed text-fg-2"
              >
                Vision and language systems built to survive contact with production:
                a fire-detection service that refuses to alert on one frame, a PPO
                agent that grades its own runs, and sign-language input turned into
                speech.
              </p>

              <div data-hero-reveal="actions" className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <a href="#work" className="btn-pill btn-pill-solid">
                    View work
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                </Magnetic>

                {/* `hidden sm:inline-flex` — keeps CTA row clean on narrow screens */}
                <Magnetic className="hidden sm:inline-flex">
                  <a
                    href={SITE.resume}
                    download
                    aria-label="Download résumé (PDF)"
                    className="btn-pill"
                  >
                    Résumé
                    <Download size={15} aria-hidden="true" />
                  </a>
                </Magnetic>

                <Magnetic>
                  <button type="button" onClick={copy} aria-live="polite" className="hero-text-action">
                    {copied ? (
                      <Check size={14} className="text-accent" aria-hidden="true" />
                    ) : (
                      <Copy size={14} aria-hidden="true" />
                    )}
                    {copied ? 'Copied' : failed ? 'Press ⌘C' : 'Copy email'}
                  </button>
                </Magnetic>
              </div>

              <p
                data-hero-reveal="credential"
                className="mt-7 hidden max-w-[52ch] items-start gap-2.5 text-[length:var(--text-meta)] uppercase leading-[1.7] tracking-[0.14em] text-fg-3 sm:flex"
              >
                <Award size={13} className="mt-[5px] shrink-0 text-accent" aria-hidden="true" />
                <span>
                  Selected — regional round, <span className="text-fg-2">TechSakshyam</span>
                </span>
              </p>
            </div>
          </div>

          {/* ── Right Column: prominent portrait ────────────────────────────── */}
          <div
            data-hero-reveal="subject"
            className="w-full justify-self-center lg:justify-self-end"
          >
            <SubjectAsset image={profileImg} alt={SITE.name} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
