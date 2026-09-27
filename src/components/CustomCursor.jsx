import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useFinePointer, usePrefersReducedMotion } from '../lib/hooks';

/**
 * Interactive targets the cursor reacts to. Declared once here rather than
 * re-declared per component, so a new `a` is picked up for free.
 *
 * `data-cursor="magnet"` is the subset that also pulls the ring toward its own
 * centre; everything else just scales the ring. Cards use it, links do not: a
 * card is a wide surface and a ring that drifts off the pointer reads as a
 * broken cursor, whereas a small link has nowhere for the ring to go.
 */
const CURSOR_SELECTOR = 'a, button, [role="button"], input, textarea, select, [data-cursor]';
const MAGNET_SELECTOR = '[data-cursor="magnet"]';

/** How far toward a magnet target's centre the ring is pulled. */
const MAGNET_PULL = 0.18;

/** Ring scale per target kind. */
const SCALE = { link: 1.45, magnet: 2.1, text: 0.6, none: 1 };

const CustomCursor = () => {
  const dotRef = useRef(null);
  const anchorRef = useRef(null);
  const magnetRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  const finePointer = useFinePointer();
  const reduceMotion = usePrefersReducedMotion();
  const enabled = finePointer && !reduceMotion;

  useEffect(() => {
    const root = document.documentElement;
    const dot = dotRef.current;
    const anchor = anchorRef.current;
    const magnet = magnetRef.current;
    const ring = ringRef.current;

    if (!enabled || !dot || !anchor || !magnet || !ring) {
      root.removeAttribute('data-cursor');
      return undefined;
    }

    root.setAttribute('data-cursor', 'on');

    // quickTo is the right primitive specifically because it caches one tween
    // per property and retargets it on every call. A gsap.to() per pointermove
    // would allocate ~120 tweens a second, and the ring would trail the dot by
    // a frame; quickTo reuses the tween and stays glued to the pointer.
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' });
    const anchorX = gsap.quickTo(anchor, 'x', { duration: 0.38, ease: 'power3' });
    const anchorY = gsap.quickTo(anchor, 'y', { duration: 0.38, ease: 'power3' });
    const magnetX = gsap.quickTo(magnet, 'x', { duration: 0.55, ease: 'power3' });
    const magnetY = gsap.quickTo(magnet, 'y', { duration: 0.55, ease: 'power3' });

    let seen = false;
    let activeTarget = null;

    const onMove = (event) => {
      const { clientX, clientY } = event;

      if (!seen) {
        // Snap on first sight. Tweening in from the origin would fly the
        // cursor diagonally across the screen on the first mouse move.
        seen = true;
        gsap.set([dot, anchor], { x: clientX, y: clientY, opacity: 1 });
      }

      dotX(clientX);
      dotY(clientY);
      anchorX(clientX);
      anchorY(clientY);
    };

    const onEnter = () => gsap.to([dot, anchor], { opacity: 1, duration: 0.25, overwrite: 'auto' });
    const onLeaveWindow = () =>
      gsap.to([dot, anchor], { opacity: 0, duration: 0.2, overwrite: 'auto' });

    const onOver = (event) => {
      const target =
        event.target instanceof Element ? event.target.closest(CURSOR_SELECTOR) : null;
      if (target === activeTarget) return;
      activeTarget = target;

      const label = labelRef.current;

      if (!target) {
        magnetX(0);
        magnetY(0);
        gsap.to(ring, { scale: SCALE.none, borderColor: '', duration: 0.3, overwrite: 'auto' });
        gsap.to(dot, { scale: 1, duration: 0.3, overwrite: 'auto' });
        if (label) label.textContent = '';
        return;
      }

      const isText = target.matches('input, textarea');
      const isMagnet = target.matches(MAGNET_SELECTOR);
      const custom = target.getAttribute('data-cursor-label');
      if (label) label.textContent = custom ?? '';

      const scale = custom ? SCALE.magnet : isMagnet ? SCALE.magnet : isText ? SCALE.text : SCALE.link;

      gsap.to(ring, {
        scale,
        borderColor: custom ? 'currentColor' : '',
        duration: 0.35,
        overwrite: 'auto',
        ease: 'back.out(2)',
      });
      gsap.to(dot, { scale: isText ? 0 : 0.55, duration: 0.3, overwrite: 'auto' });

      if (isMagnet) {
        const rect = target.getBoundingClientRect();
        const currentX = Number(gsap.getProperty(anchor, 'x')) || 0;
        const currentY = Number(gsap.getProperty(anchor, 'y')) || 0;
        // Offset from the *pointer*, not from 0 — a static delta computed from
        // the target alone would jump the ring every time the target moved.
        magnetX((rect.left + rect.width / 2 - currentX) * MAGNET_PULL);
        magnetY((rect.top + rect.height / 2 - currentY) * MAGNET_PULL);
      } else {
        magnetX(0);
        magnetY(0);
      }
    };

    const onDown = () => {
      // Relative to the live scale, not an absolute number: a hardcoded value
      // would snap the ring to the wrong size when pressing inside a card.
      const current = Number(gsap.getProperty(ring, 'scale')) || 1;
      gsap.to(ring, { scale: current * 0.68, duration: 0.1, overwrite: 'auto' });
    };

    const onUp = () => {
      if (!activeTarget) return;
      const scale = activeTarget.matches(MAGNET_SELECTOR) ? SCALE.magnet : SCALE.link;
      gsap.to(ring, { scale, duration: 0.3, overwrite: 'auto', ease: 'back.out(2.4)' });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerenter', onEnter);
    document.addEventListener('pointerleave', onLeaveWindow);
    document.addEventListener('pointerover', onOver, true);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);

    return () => {
      root.removeAttribute('data-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerenter', onEnter);
      document.removeEventListener('pointerleave', onLeaveWindow);
      document.removeEventListener('pointerover', onOver, true);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      gsap.killTweensOf([dot, anchor, magnet, ring]);
    };
  }, [enabled]);

  // Reduced motion and touch keep the platform cursor. Returning null also
  // means no `data-cursor` attribute and no hidden native cursor, so nothing
  // can get stuck in an invisible-pointer state.
  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[150]">
      {/* Layer 1: follows the pointer. CSS `translate` centres the element and
          composes with GSAP's `transform`, so the two never overwrite
          each other. */}
      <div
        ref={anchorRef}
        className="absolute left-0 top-0"
        style={{ translate: '-50% -50%', opacity: 0 }}
      >
        {/* Layer 2: the magnet offset toward a hovered card's centre. */}
        <div ref={magnetRef} className="grid place-items-center">
          {/* Layer 3: the visible ring, the only layer that scales. */}
          <div
            ref={ringRef}
            className="grid h-9 w-9 place-items-center rounded-full border border-fg-1 text-accent"
          >
            <span
              ref={labelRef}
              className="whitespace-nowrap font-mono text-[9px] leading-none tracking-[0.14em] uppercase"
            />
          </div>
        </div>
      </div>

      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-accent"
        style={{ translate: '-50% -50%', opacity: 0 }}
      />
    </div>
  );
};

export default CustomCursor;
