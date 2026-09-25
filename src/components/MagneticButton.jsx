import React, { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/**
 * Magnetic hover for primary actions. The element is pulled a short distance
 * toward the cursor and springs back on exit.
 *
 * Strength is deliberately small (10px). Past roughly this distance the effect
 * stops reading as "responsive" and starts reading as "the button is broken",
 * and it can push the hit area out from under the pointer.
 *
 * Motion values only — `useState` here would re-render on every pointermove.
 */
const STRENGTH = 10;

const MagneticButton = ({ children, className = '', ...rest }) => {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 20 });
  const y = useSpring(my, { stiffness: 260, damping: 20 });

  const handleMove = (event) => {
    if (reduceMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((event.clientX - rect.left) / rect.width - 0.5) * 2 * STRENGTH);
    my.set(((event.clientY - rect.top) / rect.height - 0.5) * 2 * STRENGTH);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  if (reduceMotion) {
    return (
      <a ref={ref} className={className} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <motion.a
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      style={{ x, y }}
      className={className}
      {...rest}
    >
      {children}
    </motion.a>
  );
};

export default MagneticButton;
