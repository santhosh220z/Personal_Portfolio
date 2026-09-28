import React from 'react';
import { motion } from 'framer-motion';
import { makeReveal, revealViewport } from '../lib/motion';
import { usePrefersReducedMotion } from '../lib/hooks';
import { PIPELINE, SKILL_GROUPS } from '../data/resume';
import SectionLabel from './SectionLabel';

/**
 * Architecture.
 *
 * Two distinct layout families, deliberately: the pipeline is a horizontal
 * four-stage flow, the skill groups are a bordered ledger. Consecutive sections
 * must not share a layout family or the page reads as one repeated template.
 */
const Architecture = () => {
  const reduceMotion = usePrefersReducedMotion();
  const { container, item } = makeReveal(reduceMotion);

  return (
    <section id="architecture" className="section-block border-t border-rule">
      <div className="shell">
        <SectionLabel
          index="02"
          eyebrow="System"
          title="How the work is built"
          lede="Every project here follows the same four stages. Keeping the pipeline fixed means the hard problems stay in the model, not in the plumbing."
        />

        {/* Pipeline */}
        <div className="mb-20 grid gap-px overflow-hidden rounded-lg border border-rule bg-[var(--rule)] sm:grid-cols-2 lg:grid-cols-4">
          {PIPELINE.map((stage, index) => (
            <motion.article
              key={stage.id}
              variants={item}
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              className="group relative bg-canvas p-6 md:p-8"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="meta meta-accent">{String(index + 1).padStart(2, '0')}</span>
                <span className="meta">{stage.caption}</span>
              </div>

              {/* Deliberately not --text-title. That token is shared with the
                  experience and credential card titles, and those are card
                  headings — raising it here to size up the pipeline would drag
                  those two sections up with it. This clamp is scoped to the
                  pipeline, which is the one place the stage name is the
                  primary read. */}
              <h3 className="mt-5 text-[length:clamp(1.5rem,2.3vw,2rem)] uppercase leading-[1.05] tracking-tight">
                {stage.label}
              </h3>

              <p className="mt-4 text-base leading-relaxed text-fg-2">{stage.detail}</p>

              {/* Connector chevron, desktop only — the grid gap already implies
                  the sequence on narrow screens. */}
              {index < PIPELINE.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 -right-1.5 hidden h-3 w-3 -translate-y-1/2 rotate-45 border-t border-r border-accent-line bg-canvas transition-colors group-hover:border-accent lg:block"
                />
              ) : null}
            </motion.article>
          ))}
        </div>

        {/* Ledger.
            The label used to sit in its own 0.8fr column while the four groups
            were squeezed into the remaining 1.2fr, which left roughly a third of
            the shell empty and forced every group to wrap its tags onto three
            lines. Promoting the label to a full-width rule and letting the four
            groups run the full width gives each ~330px instead of two groups
            sharing ~600px, and the tags stop wrapping. */}
        <div>
          <div className="mb-6 flex items-center gap-4">
            <h3 className="meta">Capability ledger</h3>
            <span className="h-px flex-1 bg-rule" aria-hidden="true" />
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="grid gap-px overflow-hidden rounded-lg border border-rule bg-[var(--rule)] sm:grid-cols-2 xl:grid-cols-4"
          >
            {SKILL_GROUPS.map((group) => (
              <motion.div key={group.id} variants={item} className="bg-canvas p-7 md:p-10">
                <div className="flex items-baseline gap-3">
                  <span className="meta meta-accent">{group.label}</span>
                  <span className="h-px flex-1 bg-rule" aria-hidden="true" />
                </div>

                <h4 className="mt-4 text-[1.5rem] leading-tight font-semibold tracking-tight text-fg-1">
                  {group.title}
                </h4>

                <ul className="mt-6 flex list-none flex-wrap gap-2.5 p-0">
                  {group.items.map((item_) => (
                    <li key={item_} className="tag">
                      {item_}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Architecture;
