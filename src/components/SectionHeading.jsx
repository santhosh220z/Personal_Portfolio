import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { makeReveal, revealViewport } from '../lib/motion';

/**
 * `eyebrow` is opt-in and deliberately rare. Rendering it on every section
 * produced the templated small-caps-above-every-headline rhythm that reads as
 * machine-made; the rule is at most one eyebrow per three sections. The
 * headline alone carries the meaning — the section's position on the page
 * already categorises it.
 */
const SectionHeading = ({ title, eyebrow }) => {
  const reduceMotion = useReducedMotion();
  const { item } = makeReveal(reduceMotion);

  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <span className="mb-4 inline-flex items-center gap-2 font-mono text-xs tracking-widest text-ethereal-on-surface-variant uppercase">
          <span className="h-1 w-1 rounded-full bg-electric-violet"></span>
          {eyebrow}
        </span>
      ) : null}
      <motion.h2
        variants={item}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className="font-sans text-3xl font-semibold tracking-tight text-balance text-ethereal-on-surface md:text-4xl"
      >
        {title}
      </motion.h2>
    </div>
  );
};

export default SectionHeading;
