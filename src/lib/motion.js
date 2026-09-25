// Single source of truth for scroll-reveal motion.
//
// These numbers used to be hand-copied into seven section components and had
// drifted into three durations (0.5/0.6), three viewport margins
// (-100px/-50px/none), six different offsets, and three hand-rolled stagger
// formulas: `index * 0.1`, `idx * 0.15`, and `(index % 4) * 0.1`. The 0.15
// variant left the last project card waiting 0.45s of delay before its 0.6s
// reveal even started. Container/child variants replace all of that with one
// declarative cascade.

// power2.out
export const EASE_OUT = [0.22, 0.61, 0.36, 1];

// Fire slightly before the element reaches the fold rather than after.
export const revealViewport = { once: true, margin: '-80px' };

// y stays in the 8-16px band so a reveal reads as a fade, not a slide, and
// staggerChildren stays at or under 0.06 so long lists do not feel sluggish.
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
