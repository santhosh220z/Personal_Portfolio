import '@testing-library/jest-dom/vitest';

/**
 * jsdom does not implement matchMedia, and every motion decision in this app is
 * gated on it. Without this stub the hook reads `undefined` and the components
 * take the motion path by accident, so the reduced-motion tests would be
 * asserting nothing.
 */
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  });
}

/**
 * Framer's `whileInView` waits on IntersectionObserver, which jsdom also lacks.
 * A no-op stub means "always intersecting", which is the correct default for a
 * test: content should be considered visible, so a test that renders a component
 * is testing its visible state rather than its pre-reveal state.
 */
if (!globalThis.IntersectionObserver) {
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  };
}

/**
 * GSAP's ScrollTrigger measures the document and schedules work against
 * requestAnimationFrame. In jsdom there is no layout, so measurements are all
 * zero and ScrollTrigger can throw. Stubbing rAF to a macrotask keeps timers
 * deterministic without pretending layout exists.
 */
globalThis.requestAnimationFrame =
  globalThis.requestAnimationFrame ?? ((cb) => setTimeout(() => cb(Date.now()), 16));
globalThis.cancelAnimationFrame =
  globalThis.cancelAnimationFrame ?? ((id) => clearTimeout(id));