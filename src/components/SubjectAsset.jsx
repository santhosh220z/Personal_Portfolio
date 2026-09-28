import React from 'react';
import { LossCurve, NeuralNet, NodeOrbit } from './geometry/MLMotif';

/**
 * The hero's subject asset: a portrait with machine-learning scaffolding as
 * decoration.
 *
 * The frame is gone. What remains is the cut-out portrait and the ML motifs — a
 * k-NN orbit around the head, a feed-forward network off the jaw, and a loss
 * curve above the shoulder — sized and placed off the silhouette's landmarks so
 * they sit in the empty regions rather than being sliced by a border.
 *
 * There is no pointer tracking. A portrait that tilts toward a cursor reads as
 * a demo, not as design, and it competes with the hero's grid backdrop for
 * attention. The decoration now is ambient: it holds its shape and lets the
 * headline and CTAs carry the interaction budget.
 */
const SubjectAsset = ({ image, alt }) => {
  return (
    <div className="relative mx-auto w-full max-w-[14rem] sm:max-w-[16rem] lg:max-w-[18rem]">
      <div className="relative aspect-[4/5] w-full">
        <img
          src={image}
          alt={alt}
          width={1000}
          height={1000}
          loading="eager"
          decoding="async"
          className="h-full w-full origin-[50%_32%] scale-[1.03] object-cover opacity-80"
        />

        <div
          aria-hidden="true"
          className="subject-mask pointer-events-none absolute inset-0 bg-accent opacity-[0.12] mix-blend-overlay"
          style={{ '--subject-mask-image': `url(${image})` }}
        />

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden text-accent">
          <NodeOrbit className="absolute left-1/2 top-[31%] w-[102%] -translate-x-1/2 -translate-y-1/2 opacity-[0.3]" />
          <NeuralNet className="absolute left-[1%] top-[44%] w-[25%] opacity-[0.28]" />
          <LossCurve className="absolute right-[1%] top-[3%] w-[23%] opacity-[0.28]" />
        </div>
      </div>
    </div>
  );
};

export default SubjectAsset;