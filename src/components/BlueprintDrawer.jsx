import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Github, X } from 'lucide-react';
import { useDialogBehaviour, useLockBodyScroll, usePrefersReducedMotion } from '../lib/hooks';
import FlowDiagram from './FlowDiagram';

/**
 * Off-canvas technical blueprint for one project.
 *
 * A right-hand drawer rather than a centred modal: the point of a blueprint is
 * that you keep reading the list behind it, and a full-bleed scrim would hide
 * the thing you are comparing against.
 *
 * Everything it renders for a11y is handled by `useDialogBehaviour` (focus
 * trap, Escape, focus restore) and `useLockBodyScroll` (freeze + scrollbar
 * compensation) — a drawer that does not restore focus strands keyboard users
 * at the top of the document.
 */
const BlueprintDrawer = ({ project, onClose }) => {
  const panelRef = useRef(null);
  const innerRef = useRef(null);
  const reduceMotion = usePrefersReducedMotion();

  const open = Boolean(project);

  useLockBodyScroll(open);
  useDialogBehaviour(open, panelRef, onClose);

  // GSAP owns the inner scroll reset so it happens in the same frame the panel
  // is revealed; React's default would leave the previous project's scroll
  // position showing for a frame on reopen.
  useEffect(() => {
    if (open && innerRef.current) innerRef.current.scrollTop = 0;
  }, [open, project?.id]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[125]">
          <motion.button
            type="button"
            aria-label="Close blueprint"
            onClick={onClose}
            tabIndex={-1}
            className="absolute inset-0 cursor-default bg-canvas-deep/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
          />

          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} — technical blueprint`}
            id={`work-${project.id}`}
            className="absolute inset-y-0 right-0 flex w-full max-w-[46rem] flex-col border-l border-rule bg-canvas shadow-2xl"
            initial={reduceMotion ? { opacity: 0 } : { x: '100%' }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <header className="flex shrink-0 items-start justify-between gap-6 border-b border-rule px-6 py-5 md:px-9 md:py-7">
              <div>
                <span className="meta meta-accent">
                  Blueprint {project.index}
                </span>
                <h3 className="mt-3 text-[clamp(1.75rem,3.4vw,2.75rem)] uppercase">
                  {project.title}
                </h3>
              </div>

              <button type="button" onClick={onClose} aria-label="Close blueprint" className="icon-btn shrink-0">
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            {/* Body */}
            <div ref={innerRef} className="flex-1 overflow-y-auto px-6 py-7 md:px-9 md:py-9">
              {/* Outcome metrics */}
              <div className="mb-9 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-rule bg-[var(--rule)]">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="bg-canvas p-4 md:p-5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-none font-extrabold text-accent">
                        {metric.value}
                      </span>
                      {metric.unit ? <span className="font-mono text-xs text-fg-2">{metric.unit}</span> : null}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="meta meta-strong">{metric.label}</span>
                      {metric.placeholder ? (
                        // A placeholder must never be readable as a result.
                        <span className="tag tag-accent" title="Illustrative figure — replace with a measured one">
                          Sample
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              {/* Problem */}
              <section className="mb-8">
                <h4 className="meta mb-3">Problem</h4>
                <p className="max-w-[62ch] leading-relaxed text-fg-2">{project.problem}</p>
              </section>

              {/* Approach */}
              <section className="mb-8">
                <h4 className="meta mb-3">Approach</h4>
                <ol className="list-none space-y-3 p-0">
                  {project.approach.map((step, index) => (
                    <li key={step} className="flex gap-4">
                      <span className="meta meta-accent shrink-0 pt-1">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="max-w-[58ch] leading-relaxed text-fg-2">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Flow */}
              <section className="mb-9">
                <h4 className="meta mb-4">System flow</h4>
                <div className="rounded-lg border border-rule bg-surface-sunken p-4 md:p-6">
                  <FlowDiagram flow={project.flow} />
                </div>
              </section>

              {/* Stack */}
              <section className="mb-9">
                <h4 className="meta mb-3">Stack</h4>
                <ul className="flex list-none flex-wrap gap-2 p-0">
                  {project.stack.map((tech) => (
                    <li key={tech} className="tag">
                      {tech}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Footer links */}
            <footer className="flex shrink-0 flex-wrap items-center gap-3 border-t border-rule px-6 py-4 md:px-9">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill"
              >
                <Github size={15} aria-hidden="true" />
                Repository
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>

              <a href={`#work-${project.id}`} onClick={onClose} className="btn-pill">
                Close
              </a>
            </footer>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
};

export default BlueprintDrawer;
