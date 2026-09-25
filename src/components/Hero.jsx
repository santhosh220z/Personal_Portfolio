import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Download, Mail } from 'lucide-react';
import { makeReveal } from '../lib/motion';
import MagneticButton from './MagneticButton';
import HeroAccent from './three/HeroAccent';
import profileImg from '../assets/profile2.jpeg';
import heroArt from '../assets/hero.png';

const Hero = () => {
  const reduceMotion = useReducedMotion();
  const { item } = makeReveal(reduceMotion);
  const ref = useRef(null);

  // Depth comes from translating layers at different rates against scroll.
  // useScroll/useTransform keep this off the React render cycle entirely.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const artY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 90]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -40]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, reduceMotion ? 1 : 0.25]);

  return (
    <section
      id="hero"
      ref={ref}
      className="scene-3d relative flex min-h-[100dvh] items-center overflow-hidden pt-24 pb-16 md:pb-24"
    >
      {/* Layer 0 — the WebGL accent. Lazy, gated, and falls back to nothing
          visible if WebGL is unavailable, so the layout never shifts. */}
      <HeroAccent />

      {/* Layer 1 — the isometric artwork, a real depth plane rather than a
          flat background image. */}
      <motion.div
        style={{ y: artY }}
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 hidden -translate-y-1/2 opacity-[0.07] lg:block lg:w-[46rem]"
      >
        <img src={heroArt} alt="" className="w-full" />
      </motion.div>

      <motion.div
        style={{ y: portraitY, opacity: fade }}
        className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-14 px-6 md:px-10 lg:grid-cols-[1.15fr_0.85fr]"
      >
        <motion.div variants={item} initial="hidden" animate="visible" className="flex flex-col items-start">
          {/* 1. eyebrow */}
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-hairline bg-ethereal-surface px-3.5 py-1.5 font-mono text-xs text-ethereal-on-surface-variant">
            <span className="h-1.5 w-1.5 rounded-full bg-electric-violet"></span>
            Open to ML engineering roles
          </span>

          {/* 2. headline — the role, not a slogan. Max 2 lines. */}
          <h1 className="text-[2.5rem] leading-[1.05] font-semibold tracking-tight text-balance text-ethereal-on-surface md:text-6xl">
            Applied ML engineer
            <br />
            <span className="text-electric-violet">who ships to production</span>
          </h1>

          {/* 3. subtext — under 20 words. */}
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ethereal-on-surface-variant">
            Computer vision and language systems in production: real-time gesture
            recognition, deepfake detection, and predictive health models. B.Tech
            Computer Science (AI &amp; ML), KIET.
          </p>

          {/* 4. CTAs — one primary, one secondary. No third. */}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <MagneticButton href="#projects" className="btn-primary inline-flex items-center gap-2 whitespace-nowrap">
              View selected work
              <ArrowRight size={16} aria-hidden="true" />
            </MagneticButton>
            <a href="/resume.pdf" download="Santhosh_Sunkara_Resume.pdf" className="btn-secondary inline-flex items-center gap-2 whitespace-nowrap">
              <Download size={16} aria-hidden="true" />
              Résumé
            </a>
          </div>
        </motion.div>

        {/* Layer 2 — portrait, nudged forward in Z. */}
        <motion.div variants={item} initial="hidden" animate="visible" className="order-first md:order-last">
          <div className="relative mx-auto w-full max-w-sm">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rotate-2 rounded-[1.75rem] border border-accent-line"
            />
            <div className="depth-2 relative overflow-hidden rounded-[1.5rem] border border-hairline bg-ethereal-surface shadow-lg">
              <img
                src={profileImg}
                alt="Santhosh Sunkara"
                className="aspect-[4/5] w-full object-cover"
                width={640}
                height={800}
              />
            </div>
            <div className="depth-3 absolute -bottom-5 -left-4 flex items-center gap-2.5 rounded-xl border border-hairline bg-ethereal-surface px-3.5 py-2.5 shadow-md">
              <Mail size={15} className="text-electric-violet" aria-hidden="true" />
              <span className="font-mono text-xs text-ethereal-on-surface-variant">
                Based in Kakinada, AP
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
