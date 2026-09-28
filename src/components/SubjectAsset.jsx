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
          subject on a narrow viewport, which is the one place a scribble that
          overlaps reads as a mistake rather than as a mark. The offsets sit off
          the crown and shoulders rather than off the old frame edge, which no
          longer exists. */}
      <Scribble
        shape="star"
        size={44}
        delay={0.5}
        className="absolute -top-5 -left-7 text-accent"
        style={{ rotate: '-12deg' }}
      />
      <Scribble
        shape="loop"
        size={58}
        delay={0.72}
        className="absolute -right-8 -top-3 text-accent"
        style={{ rotate: '8deg' }}
      />
      <Scribble
        shape="bracket"
        size={27}
        delay={0.9}
        className="absolute -bottom-3 -left-8 text-accent"
      />
      <Scribble
        shape="burst"
        size={35}
        delay={1.05}
        className="absolute -right-4 -bottom-6 text-accent"
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
        className="tilt-3d specular relative aspect-[4/5] w-full"
      >
        {/* Tint and sheen, both masked to the cut-out's own alpha.
            They were plain `absolute inset-0` fills while the portrait was an
            opaque photo, because the photo's backdrop absorbed the overflow.
            A transparent cut-out has no backdrop, so the same fills would paint
            a visible rectangle onto the canvas; `subject-mask` confines each one
            to the subject's silhouette instead.

            There is deliberately no foot fade here any more. It existed to seat
            the subject on the frame's bottom edge, and once the frame was removed
            there was no floor to blend into — on the light canvas the same
            gradient washed charcoal up the length of the jacket and turned the
            suit grey. A cut-out needs no seating. */}
        <img
          src={image}
          alt={alt}
          width={1000}
          height={1000}
          loading="eager"
          decoding="async"
          // scale/origin tighten the crop instead of the frame: the source is a
          // 1:1 cut-out, so `object-cover` already trims the sides against the
          // 4:5 frame and a scale past 1 only starts clipping the shoulders.
          // Anchoring the scale near the crown keeps the head off the top edge
          // while the sides are trimmed. Box metrics are untouched, so the hero
          // fold budget and the headline-clearance maths are unaffected.
          //
          // No grayscale and no brightness reduction. Both existed to tame an
          // opaque phone photo shot against a white wall, and neither has
          // anything to do with a studio cut-out — the wall is already gone, so
          // they were only desaturating the portrait and dimming a face that is
          // correctly exposed to begin with.
          className="h-full w-full origin-[50%_28%] scale-[1.02] object-cover"
        />

        <div
          aria-hidden="true"
          className="subject-mask pointer-events-none absolute inset-0 bg-accent opacity-[0.18] mix-blend-overlay"
          style={{ '--subject-mask-image': `url(${image})` }}
        />

        {/* Geometric scaffolding, replacing the contact-sheet registration
            marks that framed the photo. A pair of quarter arcs struck off the
            crown and a hairline down each side, all in the accent at low opacity
            so they read as drafting marks rather than as a second border around
            the subject.

            The arcs are drawn as bordered, mostly-transparent discs clipped to a
            quadrant, not as full circles: a full ring inside a portrait-sized box
            has to be clipped somewhere, and a hard horizontal or vertical cut
            across the composition reads as an accident. A quadrant's cut edges
            land in the corners, where the eye already expects a boundary.

            `pointer-events-none` keeps all of them clear of the pointer tracking
            above. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute left-1/2 top-[0.34em] h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/25 [clip-path:polygon(0_0,100%_0,0_100%)]" />
          <span className="absolute left-1/2 top-[0.34em] h-[14rem] w-[14rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-accent/20 [clip-path:polygon(100%_100%,0_100%,100%_0)]" />
          <span className="absolute inset-y-0 left-[0.7rem] w-px bg-gradient-to-b from-transparent via-accent/25 to-transparent" />
          <span className="absolute right-[0.7rem] top-0 h-[22%] w-px bg-gradient-to-b from-accent/30 to-transparent" />
        </div>
      </motion.div>

      {/* A small square bracket off the shoulder. The one hard-edged mark in the
          set, kept because a purely circular vocabulary reads as decoration
          where a single square reads as a deliberate crop. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-4 right-6 h-5 w-5 border-b-2 border-r-2 border-accent/50"
      />
    </div>
  );
};

export default SubjectAsset;
