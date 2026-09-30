import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { makeReveal, revealViewport } from '../lib/motion';
import { usePrefersReducedMotion } from '../lib/hooks';

/**
 * Supporting projects, as a compact two-up strip below the featured list.
 *
 * These link straight out to their repository rather than opening a blueprint
 * drawer, and that is the whole point of the strip. A drawer earns its height by
 * showing a problem, an approach and a system flow, and the two projects here do
 * not have that narrative to show — so giving them the same treatment would pad
 * the page with writing rather than evidence. A row that says what the thing is
 * and hands over the link is honest at the size it occupies.
 *
 * Deliberately NOT ProjectTicker in miniature. The ticker's row is a display-size
 * outlined title that fills and slides on hover, built to be the loudest thing in
 * a section. Reusing it here would put eight display-weight titles on one screen
 * and flatten the hierarchy that makes the six above read as the shortlist.
 * This is the quiet register beneath them: a bordered card grid, a mono index,
 * a small caps title, the stack as chips, and an outbound link.
 *
 * The grid is the same `gap-px` over `--rule` trick as the channels grid in
 * Contact.jsx, so a 1px rule separates the cells without any cell owning a
 * border and a doubled edge where two meet.
 */
const ProjectStrip = ({ projects }) => {
  const reduceMotion = usePrefersReducedMotion();
  const { container, item } = makeReveal(reduceMotion);

  if (!projects?.length) return null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      className="shell relative"
    >
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-rule pt-6">
        <h3 className="meta meta-strong">Also built</h3>
        <span className="meta text-fg-3">Smaller systems, same stack</span>
      </div>

      <ul className="m-0 grid list-none gap-px overflow-hidden rounded-b-lg border-x border-b border-rule bg-[var(--rule)] sm:grid-cols-2">
        {projects.map((project) => (
          <motion.li key={project.id} variants={item} className="bg-canvas">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} — open the repository on GitHub`}
              className="group flex h-full flex-col p-5 transition-colors hover:bg-surface-sunken md:p-6"
            >
              <span className="flex items-baseline gap-3">
                <span className="meta shrink-0 text-fg-3">{project.index}</span>
                <span className="text-[length:var(--text-title)] leading-tight font-bold">
                  {project.title}
                </span>
                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="ml-auto shrink-0 text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </span>

              <span className="mt-3 block text-sm leading-relaxed text-fg-2">
                {project.summary}
              </span>

              <span className="mt-4 flex flex-wrap gap-2 pt-1">
                {project.stack.map((tech) => (
                  <span key={tech} className="tag">
                    {tech}
                  </span>
                ))}
              </span>

              {/* Inside an anchor labelled by the title above, so this is a
                  visual affordance for the whole cell rather than a control of
                  its own — hence aria-hidden rather than a second link. */}
              <span className="meta mt-4 inline-flex items-center gap-2 text-fg-3" aria-hidden="true">
                <Github size={13} aria-hidden="true" />
                Repository
              </span>
            </a>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default ProjectStrip;
