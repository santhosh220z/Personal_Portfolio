import React, { useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { usePrefersReducedMotion } from '../../lib/hooks';
import { GSAP_EASE_EXPO } from '../../lib/motion';

/**
 * The hero display headline: a masked two-line entrance plus a scroll-linked
 * dispersal as the hero leaves the viewport.
 *
 * Word-level, not glyph-level. `--text-hero` reaches 9.5rem, so per-glyph would
 * mean ~24 spans per line each carrying its own transform; at that size the DOM
 * cost buys nothing a per-word offset does not already give, and it wrecks text
 * selection and screen-reader phrasing. Four word spans, no `aria-label`
 * gymnastics, and the h1 still reads "Applied ML That Ships".
 *
 * The two motions deliberately own *different elements* so they can never fight
 * over the same property: the entrance animates `yPercent`/`opacity` on the
 * masked line wrapper, the scrub animates `xPercent`/`opacity` on the words
 * inside it.
 *
 * Purpose (per the animation decision framework): *explanation* — the headline
 * disperses as the hero leaves, signalling the section is over and handing
 * attention to the work below. The scrub is `ease: 'none'` because it is
 * position-mapped to scroll progress; easing a scrub makes it trail the
 * scrollbar, which reads as lag rather than weight.
 */
const LINES = [
  [{ text: 'Applied' }, { text: 'ML', stroke: true }],
  [{ text: 'That', stroke: true }, { text: 'Ships' }],
].map((line) => line.map((word) => ({ ...word })));

/** Flat index assigned once at module load, never during render — a counter
 *  incremented inside the component body would advance twice under StrictMode's
 *  double render and flip every word's drift direction. */
let nextWordIndex = 0;
for (const line of LINES) {
  for (const word of line) {
    word.index = nextWordIndex;
    nextWordIndex += 1;
  }
}

/** Horizontal travel as the hero exits, in percent of the word's own width. */
const DRIFT = 11;

/**
 * Opacity floor once fully dispersed.
 *
 * Held at 0.45, not lower, because half the words ("ML", "That") are
 * `.stroke-type` — a 1px outline at `--stroke-alpha: 0.4`. Fading those to 0.3
 * multiplies out to an effective 0.12 alpha and the outlines effectively
 * disappear, which reads as a rendering bug rather than a dissolve. The filled
 * words would tolerate 0.2; the outlined ones do not, and one floor has to serve
 * both.
 */
const DISPERSE_OPACITY = 0.45;

const ScrubHeadline = () => {
  const rootRef = useRef(null);
  const reduceMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    if (reduceMotion) {
      // Gentler, not zero. Reduced motion drops movement, not legibility: the
      // headline stays fully visible and the dispersal is simply never
      // installed. Nothing here may leave an element at opacity 0.
      return undefined;
    }

    const lines = root.querySelectorAll('[data-scrub-line]');
    const words = root.querySelectorAll('[data-scrub-word]');

    const context = gsap.context(() => {
      // Entrance — masked rise, one beat per line.
      const entrance = gsap.timeline({ delay: 0.15 });
      entrance
        .fromTo(
          lines[0],
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.85, ease: GSAP_EASE_EXPO },
        )
        .fromTo(
          lines[1],
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.85, ease: GSAP_EASE_EXPO },
          '-=0.62',
        );

      // Dispersal — scrubbed, alternating direction, softening as it goes.
      words.forEach((word) => {
        const index = Number(word.dataset.wordIndex);
        const direction = index % 2 === 0 ? -1 : 1;

        gsap.fromTo(
          word,
          { xPercent: 0, opacity: 1 },
          {
            xPercent: DRIFT * direction,
            opacity: DISPERSE_OPACITY,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
            },
          },
        );
      });
    }, root);

    return () => context.revert();
  }, [reduceMotion]);

  return (
    <h1 ref={rootRef} className="text-[length:var(--text-hero)] uppercase">
      {LINES.map((line, lineIndex) => (
        <span key={lineIndex} className="block overflow-hidden pb-[0.04em]">
          <span data-scrub-line className="block whitespace-nowrap will-change-transform">
            {line.map((word, i) => (
              <React.Fragment key={word.text}>
                <span
                  data-scrub-word
                  data-word-index={word.index}
                  className={`inline-block will-change-transform ${
                    word.stroke ? 'stroke-type' : ''
                  }`}
                >
                  {word.text}
                </span>
                {i < line.length - 1 ? ' ' : null}
              </React.Fragment>
            ))}
          </span>
        </span>
      ))}
    </h1>
  );
};

export default ScrubHeadline;
