import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import { Flip } from 'gsap/Flip';

/**
 * Single GSAP entry point. Plugins must be registered once, globally, before
 * any tween that references them — registering per component is how you end up
 * with "ScrollTrigger is not defined" the moment a component mounts twice under
 * React 18/19 StrictMode.
 *
 * Everything that needs GSAP imports from here rather than from 'gsap' so
 * registration is guaranteed to have happened.
 */
if (typeof window !== 'undefined' && !gsap.core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger, Observer, Flip);

  // Match the CSS scroll-padding so anchor jumps clear the fixed status bar.
  ScrollTrigger.defaults({ markers: false });
}

export { gsap, ScrollTrigger, Observer, Flip };
