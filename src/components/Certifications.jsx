import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { ExternalLink, ChevronDown } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { makeReveal, revealViewport } from '../lib/motion';
import GoogleCloudLogo from '../../IMAGE/google-cloud.png';

const certificationsData = [
  {
    name: "Machine Learning Operations (MLOps) for Generative AI",
    issuer: "Google Cloud",
    date: "Sep 11, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11270258"
  },
  {
    name: "Introduction to Vertex AI Studio",
    issuer: "Google Cloud",
    date: "Sep 11, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11269094"
  },
  {
    name: "Create Image Captioning Models",
    issuer: "Google Cloud",
    date: "Sep 11, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11267817"
  },
  {
    name: "Transformer Models and BERT Model",
    issuer: "Google Cloud",
    date: "Sep 11, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11264871"
  },
  {
    name: "Encoder-Decoder Architecture",
    issuer: "Google Cloud",
    date: "Sep 11, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11264103"
  },
  {
    name: "Attention Mechanism",
    issuer: "Google Cloud",
    date: "Sep 11, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11263590"
  },
  {
    name: "Introduction to Image Generation",
    issuer: "Google Cloud",
    date: "Sep 11, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11262973"
  },
  {
    name: "Gemini for end-to-end SDLC",
    issuer: "Google Cloud",
    date: "Sep 8, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11226162"
  },
  {
    name: "Gemini for DevOps Engineers",
    issuer: "Google Cloud",
    date: "Sep 8, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11225883"
  },
  {
    name: "Gemini for Security Engineers",
    issuer: "Google Cloud",
    date: "Sep 8, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11224859"
  },
  {
    name: "Gemini for Network Engineers",
    issuer: "Google Cloud",
    date: "Sep 8, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11224362"
  },
  {
    name: "Gemini for Data Scientists and Analysts",
    issuer: "Google Cloud",
    date: "Sep 8, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11223945"
  },
  {
    name: "Gemini for Cloud Architects",
    issuer: "Google Cloud",
    date: "Sep 6, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11202445"
  },
  {
    name: "Responsible AI: Applying AI Principles with Google Cloud",
    issuer: "Google Cloud",
    date: "Aug 19, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/10686803"
  },
  {
    name: "Prompt Design in Vertex AI",
    issuer: "Google Cloud",
    date: "Aug 15, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/10600787"
  },
  {
    name: "Introduction to Responsible AI",
    issuer: "Google Cloud",
    date: "Aug 8, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/10479981"
  },
  {
    name: "Introduction to Large Language Models",
    issuer: "Google Cloud",
    date: "Aug 8, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/10469487"
  },
  {
    name: "Introduction to Generative AI",
    issuer: "Google Cloud",
    date: "Aug 2, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/10329047"
  }
];

const FEATURED_COUNT = 5;

const Certifications = () => {
  const reduceMotion = useReducedMotion();
  const { container, item } = makeReveal(reduceMotion);
  const [showAll, setShowAll] = useState(false);
  const featured = certificationsData.slice(0, FEATURED_COUNT);
  const rest = certificationsData.slice(FEATURED_COUNT);
  return (
    <section id="certifications" className="relative overflow-hidden section-spacing">

      <div className="relative z-10 section-container">
        <SectionHeading title="Certifications" />

        {/* 18 badges as an 18-cell grid was a data dump with no hierarchy. The
            first five are presented as depth-stacked cards; the rest sit behind
            a disclosure, so the section reads as "here is the evidence" instead
            of a wall. */}
        <div className="mt-10 flex items-center gap-4">
          <p className="text-sm text-ethereal-on-surface-variant">
            18 Google Cloud Skill Build badges
          </p>
          <span className="h-px flex-1 bg-hairline"></span>
        </div>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="scene-3d stack-3d mt-8 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featured.map((cert, index) => (
            <motion.li key={cert.name} variants={item}>
              {/* Depth lives on this plain div, never on the motion element:
                  Framer writes `transform` inline to animate `y`, so a
                  translateZ on the same node would be overwritten. */}
              <div
                className="h-full"
                style={{ transform: `translateZ(${(FEATURED_COUNT - index) * 8}px)` }}
              >
                <article className="group surface surface-card-hover flex h-full flex-col">
                  <div className="mb-5 flex items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg surface-2 p-1.5">
                      <img src={GoogleCloudLogo} alt="" width={687} height={687} className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-sm leading-snug font-medium text-ethereal-on-surface">
                        {cert.name}
                      </h3>
                      <p className="mt-1 font-mono text-xs text-ethereal-on-surface-variant">
                        {cert.date}
                      </p>
                    </div>
                  </div>
                  <a
                    href={cert.verifyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex min-h-[2.75rem] items-center gap-1.5 text-sm text-electric-violet transition-colors hover:text-electric-violet-hover"
                  >
                    Verify
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                </article>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-8">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            className="btn-secondary inline-flex items-center gap-2"
          >
            {showAll ? 'Show fewer' : `Show all ${certificationsData.length} badges`}
            <ChevronDown
              size={16}
              aria-hidden="true"
              className={`transition-transform duration-200 ${showAll ? 'rotate-180' : ''}`}
            />
          </button>

          {showAll ? (
            <ul className="mt-6 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((cert) => (
                <li
                  key={cert.name}
                  className="flex items-baseline justify-between gap-3 border-b border-hairline py-2.5"
                >
                  <span className="text-sm text-ethereal-on-surface-variant">{cert.name}</span>
                  <span className="shrink-0 font-mono text-xs text-ethereal-on-surface-variant">
                    {cert.date}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Certifications;