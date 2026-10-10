import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Single GSAP entry point. Plugins must be registered once, globally, before
 * any tween that references them — registering per component is how you end up
 * with "ScrollTrigger is not defined" the moment a component mounts twice under
 * React 18/19 StrictMode.
 *
 * Only ScrollTrigger is registered: it is the only plugin any component actually
 * tweens against. Observer and Flip were registered here speculatively and are
 * not imported anywhere, so they were pure bundle weight.
 *
 * Everything that needs GSAP imports from here rather than from 'gsap' so
 * registration is guaranteed to have happened.
 */
if (typeof window !== 'undefined' && !gsap.core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  // Match the CSS scroll-padding so anchor jumps clear the fixed status bar.
  ScrollTrigger.defaults({ markers: false });
}

export { gsap, ScrollTrigger };
