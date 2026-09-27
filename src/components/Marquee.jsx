import React, { useRef } from 'react';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';

/**
 * Infinite marquee.
 *
 * The track holds the item sequence twice and animates `xPercent` to -50, which
 * lands the second copy exactly where the first began — so the loop point is
 * invisible and there is no width to recompute. Using a pixel `x` instead would
 * require re-measuring on every resize and would visibly jump on reflow.
 *
 * The doubled copy is aria-hidden and the real list is exposed once via a
 * visually-hidden ul, so a screen reader hears the words once instead of
 * hearing the whole marquee twice with no indication it repeats.
 */
const Marquee = ({
  items,
  separator = '•',
  duration = 28,
  reverse = false,
  className = '',
  itemClassName = '',
}) => {
  const trackRef = useRef(null);
  const reduceMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    if (reduceMotion) return undefined;

    const track = trackRef.current;
    if (!track) return undefined;

    const context = gsap.context(() => {
      gsap.fromTo(
        track,
        { xPercent: reverse ? -50 : 0 },
        {
          xPercent: reverse ? 0 : -50,
          duration,
          ease: 'none',
          repeat: -1,
          // runBackwards keeps a reversed marquee from stuttering at the seam
          // where the tween restarts.
          ...(reverse ? { runBackwards: true } : null),
        },
      );
    }, track);

    return () => context.revert();
  }, [duration, reduceMotion, reverse]);

  const sequence = items.map((item, index) => (
    <React.Fragment key={`${item}-${index}`}>
      <span className={itemClassName}>{item}</span>
      <span className={itemClassName} aria-hidden="true">
        {separator}
      </span>
    </React.Fragment>
  ));

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div
        ref={trackRef}
        aria-hidden="true"
        className="flex w-max items-center will-change-transform"
      >
        {/* Two identical copies. The track is w-max, so xPercent -50 is
            exactly one copy's width at any viewport. */}
        <div className="flex items-center">{sequence}</div>
        <div className="flex items-center">{sequence}</div>
      </div>
    </div>
  );
};

export default Marquee;
