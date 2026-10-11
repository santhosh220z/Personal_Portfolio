import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Award, Languages } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { GSAP_EASE, makeReveal, revealViewport } from '../lib/motion';
import { usePrefersReducedMotion } from '../lib/hooks';
import { ABOUT } from '../data/resume';
import SectionLabel from './SectionLabel';
import SectionGeometry from './SectionGeometry';

/**
 * Animated number roll-up using GSAP ScrollTrigger.
 * Incrementally interpolates from 0 to target on scroll entrance.
 */
const StatCounter = ({ value, reduceMotion }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const el = ref.current;
    if (!el) return undefined;

    const match = String(value).match(/^([^\d]*)(\d+(?:\.\d+)?)([^\d]*)$/);
    if (!match) return undefined;

    const prefix = match[1] || '';
    const num = parseFloat(match[2]);
    const suffix = match[3] || '';
    const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0;

    const proxy = { val: 0 };

    const ctx = gsap.context(() => {
      gsap.to(proxy, {
        val: num,
        duration: 1.4,
        ease: GSAP_EASE,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true,
        },
        onUpdate: () => {
          if (el) {
            el.textContent = `${prefix}${proxy.val.toFixed(decimals)}${suffix}`;
          }
        },
      });
    }, el);

    return () => ctx.revert();
  }, [value, reduceMotion]);

  const match = String(value).match(/^([^\d]*)(\d+(?:\.\d+)?)([^\d]*)$/);
  const initialDisplay =
    reduceMotion || !match
      ? value
      : `${match[1] || ''}${(0).toFixed(match[2].includes('.') ? match[2].split('.')[1].length : 0)}${match[3] || ''}`;

  return <span ref={ref}>{initialDisplay}</span>;
};

const About = () => {
  const reduceMotion = usePrefersReducedMotion();
  const { container, item } = makeReveal(reduceMotion);

  return (
    <section id="about" className="section-block border-t border-rule">
      <SectionGeometry variant="about" />
      <div className="shell">
        {/* No `title` here. This section used to pass one — "Background" — and
            then render the B.Tech statement immediately beneath it at the same
            type size, which put an <h2> and an <h3> in competition and made
            "Background" the loudest word in a section about a degree. The
            statement is now the section headline and sits one heading level up,
            because with no h2 of its own an h3 would skip a level. */}
        <SectionLabel index="03" eyebrow="Profile" />

        <div className="grid gap-12 md:gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Statement */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            <h2 className="text-[length:var(--text-headline)] uppercase">
              {ABOUT.headline.map((line, index) => (
                <span
                  key={line}
                  className={index % 2 === 1 ? 'stroke-type block' : 'block'}
                >
                  {line}
                </span>
              ))}
            </h2>

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
            className="flex flex-col gap-8 lg:justify-between"
          >
            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-rule bg-[var(--rule)]">
              {ABOUT.facts.map((fact) => (
                <motion.div key={fact.label} variants={item} className="bg-canvas p-4">
                  {/* `text-fg-1`, not the accent. Three figures set at 2.25rem in
                      vermilion were the loudest thing in the section — louder than
                      the statement they were meant to support, so the eye landed on
                      a CGPA before it landed on the degree that earned it. The
                      accent stays on the section index and the labels, which is
                      where it does emphasis without shouting. */}
                  <div className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-none font-extrabold text-fg-1">
                    <StatCounter value={fact.value} reduceMotion={reduceMotion} />
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
