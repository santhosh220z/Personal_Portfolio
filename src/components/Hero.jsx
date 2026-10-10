import React, { useCallback, useRef, useState } from 'react';
import { ArrowUpRight, Award, Check, Copy, Download } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';
import { GSAP_EASE_SOFT, GSAP_EASE_EXPO } from '../lib/motion';
import { SITE } from '../data/site';
import SubjectAsset from './SubjectAsset';
import ScrubHeadline from './kinetic/ScrubHeadline';
import {
  AttentionGrid,
  LossCurve,
  NeuralNet,
  NodeGraph,
  ScatterCluster,
  SigmoidCurve,
} from './geometry/MLMotif';
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

      {/* Machine-learning backdrop.
          Three tiers, all `absolute` inside this already-`inset-0` z-0 layer so
          none of it can touch layout, and all beneath the z-10 content:

            1. a sparse node-link graph filling the whole area, which is what
               stops the space between the diagrams reading as empty canvas;
            2. the specific diagrams, placed in the regions the composition
               actually leaves free;
            3. hairlines, to tie the corners together.

          The earlier pass scattered a few generic arcs and squares and left
          most of the field bare, which is what made the hero read as a
          photograph standing on empty space. Filling it with a node graph plus
          real diagrams makes the backdrop a technical field the portrait sits
          inside, rather than a backdrop for a portrait.

          Opacities are graded by tier and all low: the display type has to stay
          the loudest thing on the page, and none of this is content. Everything
          below `md` is `hidden` — at phone widths the hero is already dense
          with content, and a diagram behind 16px copy is just noise. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 text-accent">
        {/* Tier 1 — connective tissue across the whole field. */}
        <NodeGraph className="absolute inset-0 h-full w-full opacity-[0.07]" />

        {/* Tier 2 — the diagrams, in the free regions. Left column above the
            copy, then behind the copy, then the two lower corners. */}
        <ScatterCluster className="absolute -left-16 top-[4%] hidden w-[26rem] opacity-[0.16] md:block" />
        <NeuralNet className="absolute left-[1%] top-[34%] hidden w-[22rem] opacity-[0.13] md:block" />
        <LossCurve className="absolute left-[3%] bottom-[4%] hidden w-[24rem] opacity-[0.17] lg:block" />
        <AttentionGrid className="absolute bottom-[4%] right-[3%] hidden w-[8.5rem] opacity-[0.07] lg:block" />
        <SigmoidCurve className="absolute right-[16%] top-[6%] hidden w-[15rem] opacity-[0.14] lg:block" />

        {/* Tier 3 — hairlines, angled off the copy block so they lead the eye
            down to the CTAs instead of sitting flat behind them. */}
        <span className="absolute bottom-[16%] left-[6%] hidden h-px w-[14rem] -rotate-[8deg] bg-gradient-to-r from-accent/20 to-transparent lg:block" />
        <span className="absolute bottom-[11%] left-[9%] hidden h-px w-[9rem] -rotate-[8deg] bg-gradient-to-r from-accent/15 to-transparent lg:block" />
        <span className="absolute left-[3%] top-[13%] hidden h-px w-[10rem] -rotate-[6deg] bg-gradient-to-r from-transparent via-accent/20 to-accent/20 lg:block" />
      </div>

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

        {/* Full-bleed across the shell rather than boxed into the left column.
            At 12vw the two phrases need ~1120px; the left column of a two
            column grid is only ~850px, which wraps each phrase onto a second
            line and doubles the headline's height. Spanning the shell keeps the
            type massive AND keeps the CTAs above the fold. */}
        <ScrubHeadline />

        <div className="mt-9 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
          <div>
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
              <a href="#work" className="btn-pill btn-pill-solid">
                View work
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>

              {/* `hidden sm:inline-flex` — a three-pill row measures ~441px and
                  the shell's content box is 528px at sm, so the row stays on one
                  line from sm up. Below sm it is only 335px, where the third
                  pill would wrap the row onto a second line and add 56px of
                  height to a hero that is composed to keep every CTA above the
                  fold. Mobile reaches the PDF through the footer instead. */}
              <a
                href={SITE.resume}
                download
                aria-label="Download résumé (PDF)"
                className="btn-pill hidden sm:inline-flex"
              >
                Résumé
                <Download size={15} aria-hidden="true" />
              </a>

              {/* Copying an address is a convenience, not a primary action, so it
                  steps out of the pill row rather than competing with the two
                  links as a third equal-weight target. It keeps the mono voice
                  and the icon swap, just without the container. */}
              <button type="button" onClick={copy} aria-live="polite" className="hero-text-action">
                {copied ? (
                  <Check size={14} className="text-accent" aria-hidden="true" />
                ) : (
                  <Copy size={14} aria-hidden="true" />
                )}
                {copied ? 'Copied' : failed ? 'Press ⌘C' : 'Copy email'}
              </button>
            </div>

            {/* The one verifiable distinction, placed directly beneath the actions
                it justifies rather than left for the About section to find.
                A recruiter reads the fold top-down and stops where the buttons
                are; a selection that sits three sections lower does no work
                there. Hidden below sm for the same reason the Résumé pill is —
                it is the first thing to go when the row would wrap. */}
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
            className="hero-subject-lift justify-self-center lg:justify-self-end"
          >
            <SubjectAsset image={profileImg} alt={SITE.name} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
