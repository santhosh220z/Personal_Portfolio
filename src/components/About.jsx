import React from 'react';
import { motion } from 'framer-motion';
import { Award, Languages } from 'lucide-react';
import { makeReveal, revealViewport } from '../lib/motion';
import { usePrefersReducedMotion } from '../lib/hooks';
import { ABOUT } from '../data/resume';
import SectionLabel from './SectionLabel';

const About = () => {
  const reduceMotion = usePrefersReducedMotion();
  const { container, item } = makeReveal(reduceMotion);

  return (
    <section id="about" className="section-block border-t border-rule">
      <div className="shell">
        <SectionLabel index="03" eyebrow="Profile" title="Student profile" />

        <div className="grid gap-12 md:gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Statement */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            <h3 className="text-[length:var(--text-headline)] uppercase">
              {ABOUT.headline.map((line, index) => (
                <span
                  key={line}
                  className={index % 2 === 1 ? 'stroke-type block' : 'block'}
                >
                  {line}
                </span>
              ))}
            </h3>

            <div className="mt-8 max-w-[58ch] space-y-5">
              {ABOUT.bio.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-fg-2">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Marginalia */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="flex flex-col gap-8"
          >
            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-rule bg-[var(--rule)]">
              {ABOUT.facts.map((fact) => (
                <motion.div key={fact.label} variants={item} className="bg-canvas p-4">
                  <div className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-none font-extrabold text-accent">
                    {fact.value}
                  </div>
                  <div className="meta mt-2">{fact.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.dl variants={item} className="space-y-5">
              <div>
                <dt className="meta mb-2 flex items-center gap-2">
                  <Languages size={13} aria-hidden="true" />
                  Languages
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {ABOUT.languages.map((language) => (
                    <span key={language} className="tag">
                      {language}
                    </span>
                  ))}
                </dd>
              </div>

              <div>
                <dt className="meta mb-2 flex items-center gap-2">
                  <Award size={13} aria-hidden="true" />
                  Recognition
                </dt>
                <dd className="text-sm leading-relaxed text-fg-2">{ABOUT.award}</dd>
              </div>
            </motion.dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
