import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';

/**
 * 2px accent-colored scroll progress bar pinned to the top of the viewport.
 * Uses GSAP ScrollTrigger with scrub animating scaleX from 0 to 1.
 */
const ScrollProgress = () => {
  const barRef = useRef(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: reduceMotion ? true : 0.2,
          },
        },
      );
    }, bar);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[130] h-[2px] w-full origin-left bg-accent"
      ref={barRef}
      style={{ transform: 'scaleX(0)' }}
    />
  );
};

export default ScrollProgress;
