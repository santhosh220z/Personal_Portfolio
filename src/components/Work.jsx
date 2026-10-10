import React, { Suspense, lazy, useState } from 'react';
import { Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { makeReveal, revealViewport } from '../lib/motion';
import { usePrefersReducedMotion, useMountOnDemand } from '../lib/hooks';
import { PROJECTS, SUPPORTING } from '../data/projects';
import { SITE } from '../data/site';
import SectionLabel from './SectionLabel';
import SectionGeometry from './SectionGeometry';
import ProjectTicker from './ProjectTicker';
import ProjectStrip from './ProjectStrip';

/**
 * The blueprint drawer is deferred off the critical path.
 *
 * It drags in the whole FlowDiagram/geometry vocabulary, and most visitors never
 * open one.
 *
 * The render guard at the call site is load-bearing, not a micro-optimisation:
 * `lazy()` fires its import when the component is *rendered*, not when it has
 * something to show. Rendering it with `project={null}` unconditionally pulls
 * the chunk during the first render pass anyway — measured at ~160ms on the
 * built site, ahead of the hero portrait. Rendering it only once a project is
 * actually selected is what defers it.
 */
const BlueprintDrawer = lazy(() => import('./BlueprintDrawer'));

/**
 * Featured work.
 *
 * Owns which project has an open blueprint, so the list and the drawer share
 * one source of truth. The drawer being a sibling of the list rather than a
 * child of a row is what lets it stay mounted while the list scrolls behind it.
 */
const Work = () => {
  const [openProject, setOpenProject] = useState(null);
  const reduceMotion = usePrefersReducedMotion();
  const drawerMounted = useMountOnDemand(Boolean(openProject));
  const { item } = makeReveal(reduceMotion);

  return (
    <section id="work" className="section-block border-t border-rule">
      <SectionGeometry variant="work" />

      {/* `relative` on every content child: the geometry layer is absolutely
          positioned, and an absolutely positioned box paints after in-flow
          content at the same stacking level, so without this the shapes would
          sit on top of the project list rather than behind it. */}
      <div className="shell relative">
        <SectionLabel
          index="01"
          eyebrow="Projects done"
          title="Project works"
          lede="Six systems, each with a blueprint. Open one for the problem, the approach, and the pipeline it runs through."
        />
      </div>

      {/* Full-bleed: the list runs to the viewport edges, because the hairlines
          are the layout here and they need to span. */}
      <motion.div
        variants={item}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className="shell relative"
      >
        <ProjectTicker projects={PROJECTS} onOpen={setOpenProject} />
      </motion.div>

      {/* Supporting work. Sits between the ticker and the GitHub pill so the
          outbound link stays the last thing in the section, with the two
          smaller systems reading as near-neighbours of the six rather than as
          a separate destination of their own.

          No `shell` on this wrapper: ProjectStrip's own root already carries it,
          and two of them would double the page gutter. Only the vertical rhythm
          is contributed from here. */}
      <div className="relative mt-14">
        <ProjectStrip projects={SUPPORTING} />
      </div>

      <div className="shell relative mt-10">
        <a
          href={SITE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pill"
        >
          <Github size={15} aria-hidden="true" />
          Everything on GitHub
        </a>
      </div>

      {drawerMounted ? (
        <Suspense fallback={null}>
          <BlueprintDrawer project={openProject} onClose={() => setOpenProject(null)} />
        </Suspense>
      ) : null}
    </section>
  );
};

export default Work;
