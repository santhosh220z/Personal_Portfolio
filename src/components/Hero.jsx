import React, { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Check, Copy } from 'lucide-react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';
import { SITE } from '../data/site';
import Marquee from './Marquee';
import SubjectAsset from './SubjectAsset';
import profileImg from '../assets/profile2.jpeg';

const BACKDROP_WORDS = ['Engineering', 'Intelligence', 'Motion', 'Architecture'];

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

  // Parallax: the backdrop drifts slower than the foreground, the subject
  // faster, which is what sells the sandwich as three real planes.
  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    if (reduceMotion) {
      gsap.set('[data-hero-layer]', { y: 0 });
      return undefined;
    }

    const context = gsap.context(() => {
      const layers = gsap.utils.toArray('[data-hero-layer]');

      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth ?? 0);
        gsap.fromTo(
          layer,
          { yPercent: depth * 2.2 },
          {
            yPercent: -depth * 3.4,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
            },
          },
        );
      });
    }, section);

    return () => context.revert();
  }, [reduceMotion]);

  // Entrance: the headline rises in two beats rather than all at once.
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
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
        )
        .fromTo(
          '[data-hero-reveal="line-1"]',
          { opacity: 0, yPercent: 110 },
          { opacity: 1, yPercent: 0, duration: 0.85, ease: 'expo.out' },
          '-=0.25',
        )
        .fromTo(
          '[data-hero-reveal="line-2"]',
          { opacity: 0, yPercent: 110 },
          { opacity: 1, yPercent: 0, duration: 0.85, ease: 'expo.out' },
          '-=0.62',
        )
        .fromTo(
          '[data-hero-reveal="body"]',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.4',
        )
        .fromTo(
          '[data-hero-reveal="actions"]',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.45',
        )
        .fromTo(
          '[data-hero-reveal="subject"]',
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1, duration: 0.9, ease: 'expo.out' },
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
      {/* ── Layer 0: the giant marquee backdrop ─────────────────────────── */}
      <div
        data-hero-layer="backdrop"
        data-depth="0.35"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-1 opacity-[0.11] select-none"
      >
        <Marquee
          items={BACKDROP_WORDS}
          duration={34}
          itemClassName="marquee-giant stroke-type stroke-type-thick px-[0.06em]"
        />
        <Marquee
          items={[...BACKDROP_WORDS].reverse()}
          duration={44}
          reverse
          itemClassName="marquee-giant px-[0.06em] font-extrabold"
        />
      </div>

      {/* Scrim. Opaque at the top where the display headline sits, thinning
          toward the middle so the marquee still reads as a texture band rather
          than a flat wash. Without this the outlined half of the headline sits
          on identically-shaped giant glyphs and the two cancel out. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-canvas via-canvas/75 to-canvas/30"
      />
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
        <h1 className="text-[length:var(--text-hero)] uppercase">
          <span className="block overflow-hidden pb-[0.04em]">
            <span data-hero-reveal="line-1" className="block whitespace-nowrap will-change-transform">
              Applied <span className="stroke-type">ML</span>
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.04em]">
            <span data-hero-reveal="line-2" className="block whitespace-nowrap will-change-transform">
              <span className="stroke-type">That</span> Ships
            </span>
          </span>
        </h1>

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
              <a href="#work" className="btn-pill btn-pill-solid" data-cursor>
                View work
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={copy}
                data-cursor-label={copied ? 'Copied' : undefined}
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

      {/* Scroll cue. Anchored to the section, not the viewport, so it leaves
          with the hero instead of hovering over the next section. */}
      <a
        href="#work"
        aria-label="Scroll to featured work"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-fg-3 transition-colors hover:text-accent md:flex"
      >
        <span className="meta">Scroll</span>
        <motion.span
          animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} aria-hidden="true" />
        </motion.span>
      </a>
    </section>
  );
};

export default Hero;
