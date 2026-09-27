import React, { useRef } from 'react';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';

/**
 * Hand-drawn SVG accents for the hero subject asset.
 *
 * The paths are deliberately irregular — control points are jittered rather
 * than mathematically clean. A geometric star reads as a clip-art icon, which
 * is exactly the templated look this design is avoiding; a slightly wrong star
 * reads as a mark somebody drew. `vector-effect: non-scaling-stroke` keeps the
 * hairline at 1px no matter how far the parent is scaled.
 *
 * `draw` animates the stroke on via pathLength, which is why every path is a
 * single open `d` with no `fill`: a closed path would snap shut at length 0.
 */
const PATHS = {
  star: {
    d: 'M32 3 L38.5 21.5 L56 22.5 L41 33 L47.5 51.5 L32 40 L16.5 51.5 L23 33 L8 22.5 L25.5 21.5 Z',
    viewBox: '0 0 64 56',
  },
  loop: {
    d: 'M6 30 C6 12 22 4 34 10 C46 16 50 30 42 38 C34 46 18 44 14 34 C11 26 16 20 24 21 C32 22 36 30 32 36',
    viewBox: '0 0 56 48',
  },
  bracket: {
    d: 'M18 4 L5 4 L5 52 L18 52',
    viewBox: '0 0 24 56',
  },
  arrow: {
    d: 'M3 30 C18 28 40 26 58 12 M46 12 L58 12 L58 24',
    viewBox: '0 0 62 40',
  },
  underline: {
    d: 'M4 26 C30 14 74 34 120 12 C142 2 156 18 148 30 C142 38 128 34 132 24',
    viewBox: '0 0 152 40',
  },
  burst: {
    d: 'M30 2 L34 16 L44 6 L40 20 L56 18 L42 28 L56 38 L40 36 L44 52 L34 42 L30 58 L26 42 L16 52 L20 36 L4 38 L18 28 L4 18 L20 20 L16 6 L26 16 Z',
    viewBox: '0 0 60 60',
  },
};

/**
 * @param {object}  props
 * @param {keyof PATHS} props.shape  which doodle to draw
 * @param {number}  props.size     rendered width/height in px
 * @param {number}  props.delay    seconds before the draw-on starts
 * @param {boolean} props.draw      false renders the finished stroke instantly
 */
const Scribble = ({
  shape = 'star',
  size = 64,
  delay = 0,
  draw = true,
  className = '',
  strokeWidth = 1.5,
  style,
}) => {
  const pathRef = useRef(null);
  const reduceMotion = usePrefersReducedMotion();
  const path = PATHS[shape] ?? PATHS.star;

  React.useEffect(() => {
    const node = pathRef.current;
    if (!draw || reduceMotion) return undefined;

    const context = gsap.context(() => {
      gsap.fromTo(
        node,
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.1,
          delay,
          ease: 'power2.inOut',
          // pathLength:1 normalises the dash maths, so one tween works for a
          // 24-unit bracket and a 152-unit underline alike.
          onComplete: () => gsap.set(node, { clearProps: 'strokeDasharray,strokeDashoffset' }),
        },
      );
    }, pathRef);

    return () => context.revert();
  }, [draw, delay, reduceMotion]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={path.viewBox}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={`overflow-visible ${className}`}
      style={style}
    >
      <path
        ref={pathRef}
        d={path.d}
        pathLength={1}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export default Scribble;
