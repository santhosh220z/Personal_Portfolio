import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useFinePointer, usePrefersReducedMotion } from '../lib/hooks';
import { LossCurve, NeuralNet, NodeOrbit } from './geometry/MLMotif';

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

  // Placement below is derived from the asset, not eyeballed. Sampling the
  // cut-out's alpha gives the silhouette's width profile in source pixels: the
  // crown starts at y=90, the skull is widest at y=220-260 (x 312..694, so
  // centred at 503), the jaw tapers to a 260px neck at y=500, and the shoulders
  // only reach full width past y=700. `object-cover` in a 4:5 box renders the
  // 1:1 source at 420px and crops 42px off each side, which maps those numbers
  // to: head occupying x 29-72% and y 8-54% of the box, head centre at (50%, 31%),
  // shoulders beginning at y=62% and spanning 20-88%.
  //
  // That profile is what the earlier decoration got wrong — a ring sized off the
  // box rather than off the head sat across the face, and the arcs were anchored
  // in `em` (0.34em of the inherited 16px = 5px) which put them nowhere near the
  // crown. Percentages of the box, keyed to those landmarks, is the fix.
  return (
    <div className="scene-3d relative mx-auto w-full max-w-[17rem] sm:max-w-[19rem] lg:max-w-[21rem]">
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

        {/* Machine-learning scaffolding, sized and placed off that profile.
            Each diagram sits in a region the silhouette leaves empty, and — unlike
            the arcs they replace — none of them is sliced by the box edge, which
            is what made the previous set read as accidental:

              - the k-NN orbit is centred on the head at 50%/31%, which the
                profile puts at the head's own centre, and sized so its samples
                land just outside the hairline;
              - the network takes the strip left of the jaw (x 2-28%, y 44-61%),
                which the silhouette does not enter until the shoulders at y=62%;
              - the loss curve takes the corner above the right shoulder, which
                the profile leaves empty to the top edge.

            `pointer-events-none` and `overflow-hidden` keep them clear of the
            pointer tracking and off the box's outside. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden text-accent">
          <NodeOrbit className="absolute left-1/2 top-[31%] w-[105%] -translate-x-1/2 -translate-y-1/2 opacity-[0.34]" />
          <NeuralNet className="absolute left-[2%] top-[44%] w-[26%] opacity-[0.34]" />
          <LossCurve className="absolute right-[1%] top-[3%] w-[25%] opacity-[0.32]" />
        </div>
      </motion.div>
    </div>
  );
};

export default SubjectAsset;
