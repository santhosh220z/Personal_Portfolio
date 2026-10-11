import React, { useRef, useEffect } from 'react';
import { gsap } from '../../lib/gsap';
import { usePrefersReducedMotion, useFinePointer } from '../../lib/hooks';

/**
 * Magnetic interaction wrapper for conversion buttons.
 *
 * Pulls subtly toward the cursor within a proximity threshold (~70px),
 * and springs back cleanly when the cursor moves away.
 * Gated strictly on fine pointer and reduced motion.
 */
const Magnetic = ({ children, maxDistance = 75, maxDisplacement = 8, className = '' }) => {
  const ref = useRef(null);
  const reduceMotion = usePrefersReducedMotion();
  const finePointer = useFinePointer();

  useEffect(() => {
    if (reduceMotion || !finePointer) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy);

      if (dist < maxDistance) {
        const intensity = (1 - dist / maxDistance);
        const x = (dx / (dist || 1)) * intensity * maxDisplacement;
        const y = (dy / (dist || 1)) * intensity * maxDisplacement;
        gsap.to(el, {
          x,
          y,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      } else {
        const currentX = gsap.getProperty(el, 'x');
        const currentY = gsap.getProperty(el, 'y');
        if (currentX !== 0 || currentY !== 0) {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1.1, 0.4)',
            overwrite: 'auto',
          });
        }
      }
    };

    const onLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1.1, 0.4)',
        overwrite: 'auto',
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [reduceMotion, finePointer, maxDistance, maxDisplacement]);

  return (
    <div ref={ref} className={`inline-flex ${className}`}>
      {children}
    </div>
  );
};

export default Magnetic;
