import React, { Suspense, lazy, useEffect, useState } from 'react';

/**
 * Gate for the WebGL hero accent. Three things must all be true before the
 * scene is loaded at all:
 *
 *   1. the user has not asked for reduced motion
 *   2. the browser actually exposes a WebGL context
 *   3. the viewport is wide enough that the effect is worth the bytes
 *
 * If any check fails this renders `null`, so the hero simply has no accent and
 * the layout is unchanged. `three` only reaches the network after this passes,
 * which keeps it out of the initial bundle for everyone else.
 */
const AccentScene = lazy(() => import('./AccentScene'));

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    );
  } catch {
    return false;
  }
}

const HeroAccent = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const wide = window.matchMedia('(min-width: 1024px)');

    const evaluate = () => {
      setEnabled(!reduce.matches && wide.matches && hasWebGL());
    };

    evaluate();
    reduce.addEventListener('change', evaluate);
    wide.addEventListener('change', evaluate);
    return () => {
      reduce.removeEventListener('change', evaluate);
      wide.removeEventListener('change', evaluate);
    };
  }, []);

  if (!enabled) return null;

  return (
    <Suspense fallback={null}>
      <AccentScene />
    </Suspense>
  );
};

export default HeroAccent;
