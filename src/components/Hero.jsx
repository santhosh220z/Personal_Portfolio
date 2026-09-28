import React, { useCallback, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';
import { GSAP_EASE_SOFT, GSAP_EASE_EXPO } from '../lib/motion';
import { SITE } from '../data/site';
import SubjectAsset from './SubjectAsset';
import ScrubHeadline from './kinetic/ScrubHeadline';
import profileImg from '../assets/profile3.png';

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

      {/* Geometric backdrop. A second layer under the hairline grid, carrying
          the same drafting vocabulary as the marks around the portrait — a
          quarter arc on the far left, a squared bracket and a dotted field low
          right — so the composition reads as one system rather than a decorated
          photo on an empty page.

          Deliberately no large ring here. The portrait already owns an arc
          centred on its crown, and a second circle at a similar scale on a
          similar axis read as a duplicate of it fighting for the same corner;
          the backdrop needed shapes that do not repeat what the asset is
          already saying. A circle-and-square mix also keeps the vocabulary from
          collapsing into one motif.

          Every shape is `absolute` inside this already-`inset-0` layer, so none
          of them can affect layout, and the whole layer sits at z-0 beneath the
          z-10 content. Opacities are low by design: these are structure, not
          subjects, and the display type has to stay the loudest thing here. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {/* Quarter arc on the far left, tucked under the copy. Its straight
            edges fall on the viewport boundary, so it crops rather than ends. */}
        <span className="absolute left-[-9rem] top-[18%] hidden h-[22rem] w-[22rem] rounded-t-full border border-r-0 border-b-0 border-accent/15 md:block" />

        {/* Squared bracket on the right, mirroring the small one at the
            portrait's shoulder but far larger and fainter, so the two read as a
            matched pair at different scales. */}
        <span className="absolute right-[4%] top-[26%] hidden h-[9rem] w-[7rem] border-l border-t border-accent/15 lg:block" />

        {/* Dotted field, low and right, to weight the corner the grid leaves
            empty. Built as a radial-gradient tile rather than markup so it stays
            one node instead of a few dozen, with a radial mask so the dots fade
            out instead of stopping at a hard edge. */}
        <span
          className="absolute bottom-[7%] right-[7%] hidden h-28 w-44 opacity-50 md:block"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--accent) 1px, transparent 1px)',
            backgroundSize: '10px 10px',
            maskImage: 'radial-gradient(circle, #000 18%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle, #000 18%, transparent 70%)',
          }}
        />

        {/* Two hairlines at the lower left, the same 1px rule the status bar and
            the ledger use, angled off the copy block so they lead the eye down
            to the CTAs instead of sitting flat behind them. */}
        <span className="absolute bottom-[16%] left-[6%] hidden h-px w-[14rem] -rotate-[8deg] bg-gradient-to-r from-accent/20 to-transparent lg:block" />
        <span className="absolute bottom-[11%] left-[9%] hidden h-px w-[9rem] -rotate-[8deg] bg-gradient-to-r from-accent/15 to-transparent lg:block" />
      </div>

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
              Bottom-right in the grid, but lifted by `.hero-subject-lift` so it
              is vertically centred on the headline and pinned to the shell's
              right edge. Stacked, its 420px of height was what pushed the hero
              to 971px against an 805px viewport and put both CTAs below the
              fold; overlapped, the grid row only has to be as tall as the copy.

              Centring it does mean the frame's top-left corner now crosses the
              outlined "L" of ML, whose ink reaches ~28px past the frame's left
              edge. That is deliberate: "ML" is a `.stroke-type` outline at
              --stroke-alpha 0.4 and the shell sits above the subject in z, so
              the letter reads as passing in front of the photograph rather than
              being clipped by it. Nothing wider than ~17rem clears that glyph,
              and 17rem is the un-lifted mobile size, so shrinking away the
              overlap is not an option that keeps the portrait prominent. */}
          <div
            data-hero-reveal="subject"
            className="hero-subject-lift justify-self-center lg:justify-self-end lg:self-start"
          >
            <SubjectAsset image={profileImg} alt={SITE.name} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
