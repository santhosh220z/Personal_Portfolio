import React, { useCallback, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';
import { GSAP_EASE_SOFT, GSAP_EASE_EXPO } from '../lib/motion';
import { SITE } from '../data/site';
import SubjectAsset from './SubjectAsset';
import ScrubHeadline from './kinetic/ScrubHeadline';
import profileImg from '../assets/profile2.jpeg';

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
        <div data-hero-reveal="eyebrow" className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="meta meta-accent">{SITE.role}</span>
          <span className="hidden h-3 w-px bg-rule sm:block" aria-hidden="true" />
          <span className="meta">{SITE.location}</span>
        </div>

        {/* Full-bleed across the shell rather than boxed into the left column.
            At 12vw the two phrases need ~1120px; the left column of a two
            column grid is only ~850px, which wraps each phrase onto a second
            line and doubles the headline's height. Spanning the shell keeps the
            type massive AND keeps the CTAs above the fold. */}
        <ScrubHeadline />

        <div className="mt-9 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:gap-16">
          <div>
            <p
              data-hero-reveal="body"
              className="max-w-[54ch] text-balance text-[length:var(--text-lede)] leading-relaxed text-fg-2"
            >
              Vision and language systems built to survive contact with production:
              real-time gesture recognition, deepfake forensics, and clinical risk
              models.
            </p>

            <div data-hero-reveal="actions" className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#work" className="btn-pill btn-pill-solid">
                View work
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={copy}
                aria-live="polite"
                className="btn-pill"
              >
                {copied ? (
                  <Check size={15} className="text-accent" aria-hidden="true" />
                ) : (
                  <Copy size={15} aria-hidden="true" />
                )}
                {copied ? 'Copied' : failed ? 'Press ⌘C' : 'Copy email'}
              </button>
            </div>
          </div>

          {/* ── Layer 2: the subject asset ───────────────────────────────────
              Pulled up 10rem on large screens so it overlaps the headline's
              baseline instead of stacking beneath it. Stacked, its 380px of
              height was what pushed the hero to 971px against an 805px
              viewport and put both CTAs below the fold; overlapped, the grid
              row only has to be as tall as the copy. The two phrases end
              around x=990 at this size, and this column starts past x=1050, so
              the portrait layers over empty canvas rather than over type. */}
          <div
            data-hero-reveal="subject"
            className="justify-self-center lg:-mt-40 lg:justify-self-end"
          >
            <SubjectAsset image={profileImg} alt={SITE.name} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
