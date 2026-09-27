// Single source of truth for reveal motion and easing.
//
// The Framer presets below are declarative (container/child variants), so a
// section fades in as one cascade instead of each child hand-rolling its own
// delay. The GSAP easings are shared with ScrollTrigger timelines so a scrubbed
// parallax and a tapped drawer open with the same feel.

/** Shared with `makeReveal`. power2.out. */
export const EASE_OUT = [0.22, 0.61, 0.36, 1];

/** GSAP string form of the same curve, for timelines built outside React. */
export const GSAP_EASE = 'power2.out';

export const GSAP_EASE_SOFT = 'power3.out';

export const GSAP_EASE_EXPO = 'expo.out';

/** Fire slightly before the element reaches the fold rather than after. */
export const revealViewport = { once: true, margin: '-80px' };

/**
 * y stays in the 8-16px band so a reveal reads as a fade rather than a slide,
 * and staggerChildren stays at or under 0.06 so a long list is not sluggish.
 */
export const makeReveal = (reduceMotion) =>
  reduceMotion
    ? {
        container: { hidden: {}, visible: { transition: { staggerChildren: 0 } } },
        item: {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0 } },
        },
      }
    : {
        container: { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } },
        item: {
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
        },
      };
