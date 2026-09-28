import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { makeReveal, revealViewport } from '../lib/motion';
import { usePrefersReducedMotion } from '../lib/hooks';
import { CERTIFICATIONS, EDUCATION, FEATURED_CERTIFICATIONS } from '../data/resume';
import SectionLabel from './SectionLabel';

const Education = () => {
  const reduceMotion = usePrefersReducedMotion();
  const { container, item } = makeReveal(reduceMotion);

  return (
    <section id="education" className="section-block border-t border-rule">
      <div className="shell">
        <SectionLabel index="05" eyebrow="Training" title="Education" />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="grid gap-px overflow-hidden rounded-lg border border-rule bg-[var(--rule)] lg:grid-cols-3"
        >
          {EDUCATION.map((entry) => (
            <motion.article key={entry.institution} variants={item} className="bg-canvas p-5 md:p-7">
              <span className="meta">{entry.period}</span>

              <h3 className="mt-4 text-[length:var(--text-title)]">{entry.degree}</h3>
              <p className="mt-1.5 text-sm text-accent">{entry.major}</p>

              <p className="mt-4 text-sm text-fg-2">{entry.institution}</p>
              <p className="mt-3 text-sm leading-relaxed text-fg-2">{entry.details}</p>

              {entry.courses.length > 0 ? (
                <ul className="mt-5 flex list-none flex-wrap gap-1.5 p-0">
                  {entry.courses.map((course) => (
                    <li key={course} className="tag">
                      {course}
                    </li>
                  ))}
                </ul>
              ) : null}
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/**
 * Certifications.
 *
 * A curated six rather than all eighteen. Every badge is still in the data
 * file, but twelve of them are role-specific Gemini variants (DevOps, Security,
 * Network, Cloud Architect, Data Scientists) or near-duplicate intros, and
 * rendering them all made the section read as a data dump rather than as
 * evidence. The six shown span AI and LLM fundamentals, transformers,
 * prompting, MLOps, and ethics, which is the range the rest of the CV claims.
 */
const Certifications = () => {
  const reduceMotion = usePrefersReducedMotion();
  const { container, item } = makeReveal(reduceMotion);

  return (
    <section id="certifications" className="section-block border-t border-rule">
      <div className="shell">
        <SectionLabel
          index="06"
          eyebrow="Credentials"
          title="Certifications"
          lede={`${FEATURED_CERTIFICATIONS.length} of ${CERTIFICATIONS.length} Google Cloud Skill Build badges, chosen to span generative AI, LLMs, MLOps, and responsible AI.`}
        />

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="grid list-none gap-px overflow-hidden rounded-lg border border-rule bg-[var(--rule)] p-0 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURED_CERTIFICATIONS.map((cert) => (
            <motion.li key={cert.href} variants={item} className="group bg-canvas">
              <a
                href={cert.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col p-5 transition-colors hover:bg-surface-sunken md:p-6"
              >
                <span className="meta">Google Cloud</span>
                <h3 className="mt-3 text-sm leading-snug font-medium text-fg-1">
                  {cert.name}
                </h3>
                <span className="meta mt-auto flex items-center gap-1.5 pt-5 text-accent">
                  Verify
                  <ArrowUpRight size={12} aria-hidden="true" />
                </span>
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};

export { Education, Certifications };
