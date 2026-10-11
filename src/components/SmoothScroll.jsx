import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';

/**
 * Momentum smooth scrolling powered by Lenis.
 * Synchronizes with GSAP ScrollTrigger for scroll-driven scrubbed effects.
 * Automatically coordinates internal anchor links with fixed header offset.
 * Fully bypasses under prefers-reduced-motion.
 */
const SmoothScroll = () => {
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8,
    });

    window.__lenis = lenis;

    // Connect Lenis scroll events to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP's central requestAnimationFrame ticker
    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Intercept internal hash links to scroll smoothly with offset
    const handleAnchorClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const hash = link.getAttribute('href');
      if (!hash || hash === '#' || hash === '#main-content') return;

      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -70 });
        window.history.pushState(null, '', hash);
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      window.__lenis = null;
    };
  }, [reduceMotion]);

  return null;
};

export default SmoothScroll;
