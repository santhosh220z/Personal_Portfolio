import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useFinePointer, usePrefersReducedMotion } from '../lib/hooks';
import Scribble from './Scribble';

const MAX_TILT = 9; // degrees at the corner of the frame
const MAX_SHEEN = 0.9; // peak opacity of the specular sweep
const LIFT = 18; // px the frame floats toward the viewer

/**
 * The hero's subject asset: a portrait, a hand-drawn frame, and a pointer
 * response.
 *
 * Two separate effects share one pointer sample, and they must stay separate:
 *
 *  1. Tilt is a spring on rotateX/rotateY. It is springy so the frame has mass
 *     and settles after the pointer stops.
 *  2. The specular sweep is a direct, unsprung write to a CSS custom property
 *     consumed by `.specular::after`. It must NOT be sprung — a light source
 *     that keeps moving after your hand stops reads as a bug, not as polish.
 *
 * Everything is driven from motion values rather than state, so a pointermove
 * never triggers a React render.
 */
const SubjectAsset = ({ image, alt }) => {
  const frameRef = useRef(null);
  const reduceMotion = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const interactive = finePointer && !reduceMotion;

  // Normalised 0..1 across the frame.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 190, damping: 20, mass: 0.5 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateY = useTransform(sx, [0, 1], [-MAX_TILT, MAX_TILT]);
  const rotateX = useTransform(sy, [0, 1], [MAX_TILT, -MAX_TILT]);
  const translateZ = useTransform(sx, [0, 1], [0, LIFT]);

  const onPointerMove = (event) => {
    const node = frameRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width;
    const ny = (event.clientY - rect.top) / rect.height;

    px.set(nx);
    py.set(ny);

    // Written straight to the DOM. The spec is a background-image paint, so it
    // must bypass React and the spring entirely to stay under the pointer.
    node.style.setProperty('--sheen-x', `${nx * 100}%`);
    node.style.setProperty('--sheen-y', `${ny * 100}%`);
    node.style.setProperty('--sheen-o', String(MAX_SHEEN));
  };

  const onPointerLeave = () => {
    px.set(0.5);
    py.set(0.5);
    frameRef.current?.style.setProperty('--sheen-o', '0');
  };

  // The frame's max-width is a measured ceiling, not a guess. The hero headline
  // is full-bleed across the shell while this sits in a fixed-fraction column,
  // so the two converge as the viewport narrows. Sweeping the width and
  // measuring the last line's glyphs against the frame's left edge: at 1440x900
  // and 1920x1080, 21rem leaves 18px and 23px of clearance; 22rem leaves only
  // 2px and 7px; 23rem overlaps the "S" of SHIPS outright. Narrower viewports
  // already overlapped before this change (1280 clears by -3px at the old 19rem)
  // because the display type scales on vw while the column does not. Fixing
  // that means touching the type scale, which is a separate decision.
  return (
    <div className="scene-3d relative mx-auto w-full max-w-[17rem] sm:max-w-[19rem] lg:max-w-[21rem]">
      {/* Hand-drawn accents. `text-accent` is inherited so they follow the
          theme automatically rather than hardcoding the vermilion. Sized in px
          because they are absolute: at a fluid size they would collide with the
          frame edge on a narrow viewport, which is the one place a scribble
          that overlaps reads as a mistake rather than as a mark. The sizes track
          the frame growing from 19rem to 21rem so they stay in proportion
          instead of shrinking into insignificance against the larger portrait. */}
      <Scribble
        shape="star"
        size={44}
        delay={0.5}
        className="absolute -top-7 -left-8 text-accent"
        style={{ rotate: '-12deg' }}
      />
      <Scribble
        shape="loop"
        size={58}
        delay={0.72}
        className="absolute -right-10 -top-5 text-accent"
        style={{ rotate: '8deg' }}
      />
      <Scribble
        shape="bracket"
        size={27}
        delay={0.9}
        className="absolute -bottom-5 -left-9 text-accent"
      />
      <Scribble
        shape="burst"
        size={35}
        delay={1.05}
        className="absolute -right-5 -bottom-8 text-accent"
        style={{ rotate: '10deg' }}
      />

      <motion.div
        ref={frameRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={
          interactive
            ? { rotateX, rotateY, z: translateZ }
            : undefined
        }
        className="tilt-3d specular relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-rule-strong bg-surface-sunken"
      >
        <img
          src={image}
          alt={alt}
          width={1024}
          height={1280}
          loading="eager"
          decoding="async"
          // brightness-90 plus contrast-125 is what actually tames a portrait
          // shot against a white wall: grayscale alone leaves the highlights
          // blown, and on a #0B0B0C canvas a bright rectangle reads as a hole
          // punched in the page rather than as a photograph.
          //
          // scale/origin tighten the crop instead of the frame. The source is
          // 1024x1280, the same 4:5 as the frame, so `object-cover` never crops
          // and the original loose framing is what leaves the subject small.
          // Anchoring the scale near the face pulls the crop in while
          // `overflow-hidden` trims the surplus wall. Frame metrics are
          // untouched, so the hero fold budget is unaffected.
          className="h-full w-full origin-[48%_34%] scale-[1.28] object-cover grayscale contrast-125 brightness-90"
        />

        {/* Duotone + knock-back.
            `luminosity`/overlay pulls the photograph into the charcoal/lime
            palette without a real cut-out PNG, and a multiply pass over the
            canvas colour drops the residual white of the backdrop. Both read as
            blends, so they survive a theme swap instead of needing one value
            per mode. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-accent opacity-[0.16] mix-blend-overlay"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-canvas mix-blend-multiply opacity-45" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-canvas-deep via-transparent to-canvas-deep/40"
        />

        {/* Corner registration marks, the kind printed on a contact sheet. */}
        <div aria-hidden="true" className="absolute inset-3">
          {[
            'left-0 top-0 border-l border-t',
            'right-0 top-0 border-r border-t',
            'left-0 bottom-0 border-l border-b',
            'right-0 bottom-0 border-r border-b',
          ].map((position) => (
            <span
              key={position}
              className={`absolute h-4 w-4 border-accent opacity-70 ${position}`}
            />
          ))}
        </div>
      </motion.div>

      {/* Offset frame, sitting behind the portrait in Z. */}
      <div
        aria-hidden="true"
        className="absolute -inset-3 -z-10 rounded-lg border border-accent-line"
      />
    </div>
  );
};

export default SubjectAsset;
