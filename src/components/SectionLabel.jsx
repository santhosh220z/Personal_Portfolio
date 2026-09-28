import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { revealViewport } from '../lib/motion';
import ReactiveTitle from './kinetic/ReactiveTitle';

/**
 * Numbered section kicker: `03 — Featured Work`.
 *
 * `eyebrow` is the small line above the title and is deliberately opt-in. The
 * old design used one on every section, which produced the templated
 * small-caps-above-every-headline rhythm that reads as machine-made. Rule of
 * thumb: at most one in three sections.
 */
const SectionLabel = ({ index, eyebrow, title, lede, id }) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mb-10 max-w-3xl md:mb-16">
      {eyebrow ? (
        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: reduceMotion ? 0 : 0.4 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="mb-5 flex items-center gap-4"
        >
          <span className="meta meta-accent">{index}</span>
          <span className="h-px w-10 bg-accent" aria-hidden="true" />
          <span className="meta">{eyebrow}</span>
        </motion.div>
      ) : null}

      <ReactiveTitle id={id}>
        {title}
      </ReactiveTitle>

      {lede ? (
        <motion.p
          variants={{
            hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
            visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.08, ease: [0.22, 0.61, 0.36, 1] } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="mt-6 max-w-[56ch] text-[length:var(--text-lede)] leading-relaxed text-fg-2"
        >
          {lede}
        </motion.p>
      ) : null}
    </div>
  );
};

export default SectionLabel;
