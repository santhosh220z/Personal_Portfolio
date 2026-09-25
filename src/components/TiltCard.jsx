import React, { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

/**
 * 3D tilt-on-hover card.
 *
 * The pointer position is tracked with Motion values, never `useState`: a
 * state update per mousemove would re-render the whole React tree on every
 * frame. `useSpring` adds the slight lag that makes the movement feel physical
 * rather than glued to the cursor.
 *
 * Values are written to CSS custom properties and the actual transform is
 * composed in CSS (.tilt-card), so the browser owns the compositing.
 */
const MAX_TILT = 7; // degrees

const TiltCard = ({ children, className = '', lift = false }) => {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 220, damping: 22, mass: 0.4 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateY = useTransform(sx, [0, 1], [-MAX_TILT, MAX_TILT]);
  const rotateX = useTransform(sy, [0, 1], [MAX_TILT, -MAX_TILT]);

  const handleMove = (event) => {
    if (reduceMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={reduceMotion ? undefined : { rotateX, rotateY }}
      className={`tilt-3d ${lift ? 'tilt-lift' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default TiltCard;
