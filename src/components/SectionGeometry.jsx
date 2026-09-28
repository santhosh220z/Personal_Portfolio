import React from 'react';
import {
  ArcQuarter,
  Chevrons,
  Circle,
  Crosshair,
  DotField,
  Hatch,
  HexField,
  Lattice,
  PlusGrid,
  Rings,
  Steps,
  Sweep,
  Triangles,
} from './geometry/GeometryMotif';

/**
 * Background drafting for a page section.
 *
 * Six sections need a piece of geometry in their negative space, and the whole
 * point of a component like this is that none of them hand-rolls the same
 * absolutely-positioned SVG layer. Each variant is a different arrangement of
 * the shared motif vocabulary — the arrangement is what distinguishes one
 * section from the next, because identical decoration repeated six times reads
 * as a template rather than as six sections.
 *
 * The layer is always `absolute inset-0 overflow-hidden` inside a section that
 * is already `position: relative` (`.section-block`), `pointer-events-none` so
 * it never intercepts a click on the content beneath, and `aria-hidden` because
 * none of it carries meaning. Opacities sit between 0.07 and 0.2: the content is
 * the subject, and a background that competes with it is a mistake.
 *
 * `z-0` requires the section's content to be positioned as well, or this layer
 * would paint on top of it — an absolutely positioned box paints after in-flow
 * content at the same stacking level. Every section below therefore carries
 * `relative` on its content wrapper. That is a real constraint of this approach
 * and the reason it is worth stating rather than leaving to be rediscovered.
 */
const SectionGeometry = ({ variant }) => {
  const shapes = VARIANTS[variant];
  if (!shapes) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden text-accent"
    >
      {shapes}
    </div>
  );
};

/**
 * The arrangement per section. Chosen against what each section actually is:
 * chevrons and a staircase for the pipeline, a survey mark for the project
 * blueprints, a hexagon tessellation for the certification grid, a horizon for
 * the timeline.
 *
 * `hidden` below `md`/`lg` on the larger shapes is deliberate. A phone viewport
 * is narrow enough that a 34rem motif lands in the middle of the copy, and
 * decoration sitting on top of body text is worse than no decoration.
 */
const VARIANTS = {
  /* Projects — a survey mark and a lattice, like a drawing sheet. */
  work: (
    <>
      <Crosshair className="absolute -right-6 top-8 hidden w-40 opacity-[0.16] md:block" />
      <Lattice className="absolute -left-10 bottom-4 hidden w-[26rem] opacity-[0.1] lg:block" />
      <Hatch className="absolute right-[18%] top-[42%] hidden w-56 opacity-[0.1] xl:block" />
      <DotField className="absolute bottom-10 left-[38%] hidden w-64 opacity-[0.1] lg:block" />
      <Circle className="absolute -top-8 left-[12%] hidden w-28 opacity-[0.12] lg:block" />
    </>
  ),

  /* Architecture — direction and stages. */
  architecture: (
    <>
      <Chevrons className="absolute -right-12 top-10 hidden w-[30rem] opacity-[0.1] lg:block" />
      <Steps className="absolute bottom-6 left-[4%] hidden w-64 opacity-[0.14] lg:block" />
      <ArcQuarter className="absolute -left-16 top-[30%] hidden w-72 opacity-[0.1] xl:block" />
      <DotField className="absolute right-[24%] bottom-[6%] hidden w-56 opacity-[0.1] xl:block" />
    </>
  ),

  /* Experience — a timeline, so a horizon and a long vertical-ish hatch. */
  experience: (
    <>
      <Sweep className="absolute -top-6 right-[8%] hidden w-[34rem] opacity-[0.1] lg:block" />
      <Hatch className="absolute -left-8 bottom-[8%] hidden w-64 opacity-[0.09] lg:block" />
      <Crosshair className="absolute right-[6%] bottom-[12%] hidden w-24 opacity-[0.14] md:block" />
      <DotField className="absolute left-[3%] top-[6%] hidden w-52 opacity-[0.09] xl:block" />
    </>
  ),

  /* Education — concentric rings and a triangle row. */
  education: (
    <>
      <Rings className="absolute -right-10 -top-10 hidden w-[24rem] opacity-[0.11] lg:block" />
      <Triangles className="absolute -left-8 bottom-[10%] hidden w-72 opacity-[0.1] lg:block" />
      <PlusGrid className="absolute right-[16%] bottom-[6%] hidden w-40 opacity-[0.1] xl:block" />
      <Circle className="absolute left-[46%] top-[4%] hidden w-20 opacity-[0.12] md:block" />
    </>
  ),

  /* About — a profile statement, so a survey mark and a dot field. */
  about: (
    <>
      <Crosshair className="absolute -right-8 top-[8%] hidden w-48 opacity-[0.14] md:block" />
      <DotField className="absolute -left-10 bottom-[12%] hidden w-64 opacity-[0.1] lg:block" />
      <Hatch className="absolute right-[20%] top-[38%] hidden w-56 opacity-[0.09] xl:block" />
      <Circle className="absolute left-[40%] top-[4%] hidden w-24 opacity-[0.12] lg:block" />
    </>
  ),

  /* Certifications — a grid of badges, so a tessellation. */
  certifications: (
    <>
      <HexField className="absolute -left-12 -top-8 hidden w-[30rem] opacity-[0.12] lg:block" />
      <PlusGrid className="absolute bottom-[4%] right-[4%] hidden w-44 opacity-[0.1] xl:block" />
      <Hatch className="absolute right-[30%] top-[6%] hidden w-48 opacity-[0.09] xl:block" />
    </>
  ),
};

/**
 * The page-wide backdrop. Fixed rather than absolute so the shapes stay in view
 * through a 6,000px scroll — an absolute layer that tall would put every shape
 * hundreds of pixels below the fold at any given moment.
 *
 * `z-0`, not `-z-10`, and that is worth being precise about because the obvious
 * choice is wrong here. A negative z-index paints at step 2 of the stacking
 * context, but the wrapper div this sits inside is an in-flow block with an
 * opaque `bg-canvas`, and an in-flow block's background paints at step 3 — so
 * the backdrop was measured rendering underneath its own parent's background and
 * was invisible at any opacity. `z-0` puts it at the same level as the content,
 * and because every content block (`main`, `header`, `footer`) is itself
 * positioned and comes later in the DOM, all of them paint over it.
 *
 * `overflow-hidden` is set on this element rather than relied upon from an
 * ancestor, so the shapes cannot cause horizontal overflow however wide they are.
 */
export const PageBackdrop = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 z-0 overflow-hidden text-accent"
  >
    <Lattice className="absolute -left-[8%] top-[6%] hidden w-[46rem] opacity-[0.08] lg:block" />
    <Lattice className="absolute -right-[8%] bottom-[4%] hidden w-[42rem] opacity-[0.08] lg:block" />
    <Rings
      className="absolute left-1/2 top-[58%] hidden w-[38rem] -translate-x-1/2 opacity-[0.07] lg:block"
    />
    <DotField className="absolute left-[6%] top-[42%] hidden w-[26rem] opacity-[0.09] xl:block" />
  </div>
);

export default SectionGeometry;
