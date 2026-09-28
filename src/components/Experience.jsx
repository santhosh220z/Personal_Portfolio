import React from 'react';
import { motion } from 'framer-motion';
import { makeReveal, revealViewport } from '../lib/motion';
import { usePrefersReducedMotion } from '../lib/hooks';
import { EXPERIENCES } from '../data/resume';
import SectionLabel from './SectionLabel';
import SectionGeometry from './SectionGeometry';

/**
 * Experience.
 *
 * A hairline timeline, not a card grid: the skill groups above already use a
 * bordered ledger, and a role is inherently a span of time, which a numbered
 * rail states more honestly than a card does.
 */
const Experience = () => {
  const reduceMotion = usePrefersReducedMotion();
  const { container, item } = makeReveal(reduceMotion);

  return (
    <section id="experience" className="section-block border-t border-rule">
      <SectionGeometry variant="experience" />

      {/* `relative` so the geometry layer stays behind this content. */}
      <div className="shell relative">
        <SectionLabel index="04" eyebrow="Track record" title="Where this has been applied" />

        <motion.ol
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="relative list-none border-t border-rule p-0"
        >
          {EXPERIENCES.map((role, index) => (
            <motion.li
              key={role.company}
              variants={item}
              className="group relative grid gap-4 border-b border-rule py-8 md:grid-cols-[7rem_1fr_auto] md:gap-10 md:py-10"
            >
              {/* Period */}
              <div className="flex items-center gap-3 md:block">
                <span className="meta meta-accent">{String(index + 1).padStart(2, '0')}</span>
                <span className="meta md:mt-2 md:block">{role.period}</span>
              </div>

              {/* Body */}
              <div>
                <h3 className="text-[length:var(--text-title)] uppercase">{role.role}</h3>
                <p className="mt-1.5 text-sm text-fg-2">{role.company}</p>

                <p className="mt-4 max-w-[64ch] leading-relaxed text-fg-2">
                  {role.description}
                </p>

                <p className="mt-4 max-w-[64ch] text-sm leading-relaxed text-fg-1">
                  <span className="meta meta-accent mr-2">Impact</span>
                  {role.impact}
                </p>
              </div>

              {/* Stack, right aligned */}
              <ul className="flex list-none flex-wrap gap-1.5 p-0 md:max-w-[16rem] md:justify-end md:self-start">
                {role.stack.map((tech) => (
                  <li key={tech} className="tag">
                    {tech}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
};

export default Experience;
