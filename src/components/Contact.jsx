import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import { makeReveal, revealViewport } from '../lib/motion';
import { usePrefersReducedMotion } from '../lib/hooks';
import { SITE } from '../data/site';
import SectionLabel from './SectionLabel';

const CHANNELS = [
  {
    label: 'Email',
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    Icon: Mail,
    note: 'Fastest route',
  },
  {
    label: 'GitHub',
    value: '@santhosh220z',
    href: SITE.github,
    Icon: Github,
    note: 'Source',
  },
  {
    label: 'LinkedIn',
    value: 'Santhosh Sunkara',
    href: SITE.linkedin,
    Icon: Linkedin,
    note: 'Professional',
  },
];

const Contact = () => {
  const reduceMotion = usePrefersReducedMotion();
  const { container, item } = makeReveal(reduceMotion);

  return (
    <section id="contact" className="section-block border-t border-rule">
      <div className="shell">
        <SectionLabel
          index="07"
          eyebrow="Contact"
          title="Open to work in AI/ML"
          lede="Looking for an entry-level AI/ML role — applied machine learning, computer vision, or MLOps — where I can keep building and learn from a team. I read everything that comes in."
        />

        {/* Oversized mail link. The address is the point of the section, so it
            is set at display size rather than tucked into a card. */}
        <motion.a
          variants={item}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          href={`mailto:${SITE.email}`}
          className="group block border-y border-rule py-8 md:py-12"
        >
          <span className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="font-mono text-[length:var(--text-meta)] tracking-[0.16em] text-fg-2 uppercase">
              Write to
            </span>
            <span className="flex items-center gap-3 text-[clamp(1.1rem,3.4vw,2.5rem)] leading-tight font-extrabold break-all">
              <span className="stroke-type transition-[--stroke-alpha] duration-500 group-hover:[--stroke-alpha:1]">
                {SITE.email}
              </span>
              <ArrowUpRight
                size={28}
                aria-hidden="true"
                className="shrink-0 text-accent transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </span>
          </span>
        </motion.a>

        {/* Channels */}
        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="mt-px grid list-none gap-px overflow-hidden rounded-b-lg border-x border-b border-rule bg-[var(--rule)] sm:grid-cols-3"
        >
          {CHANNELS.map((channel) => (
            <motion.li key={channel.label} variants={item}>
              <a
                href={channel.href}
                target={channel.href.startsWith('http') ? '_blank' : undefined}
                rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex h-full items-center gap-4 bg-canvas p-5 transition-colors hover:bg-surface-sunken md:p-6"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-rule text-accent">
                  <channel.Icon size={18} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="meta block">{channel.label}</span>
                  <span className="mt-1.5 block truncate text-sm text-fg-1">{channel.value}</span>
                </span>
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};

export default Contact;
