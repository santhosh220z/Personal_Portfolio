import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Mail, Brain, Cpu } from 'lucide-react';
import profileImg from '../assets/profile2.jpeg';

const Hero = () => {
  const highlights = [
    { label: 'AI Projects', value: '10+' },
    { label: 'Certifications', value: '18+' },
    { label: 'Core Stack', value: 'Python + CV' },
  ];

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden pt-36 pb-16 md:pt-40 md:pb-24">
      <div className="pointer-events-none absolute left-[8%] top-1/4 h-80 w-80 rounded-full bg-electric-violet/10 blur-[120px] animate-float"></div>
      <div className="pointer-events-none absolute bottom-[12%] right-[6%] h-[22rem] w-[22rem] rounded-full bg-tertiary/10 blur-[120px] animate-float-delayed"></div>
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[40rem] w-[40rem] rounded-full bg-electric-violet/5 blur-[200px] animate-pulse-glow"></div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 px-6 md:grid-cols-2 md:px-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="order-2 flex flex-col items-start md:order-1"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full glass px-4 py-2"
          >
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-electric-violet shadow-[0_0_12px_rgba(139,92,246,0.8)]"></span>
            <span className="font-mono label-sm text-ethereal-on-surface-variant">Open to opportunities</span>
          </motion.div>

          <h1 className="mb-4 font-display display-lg text-ethereal-on-surface md:display-lg">
            Building
            <br />
            <span className="text-gradient">intelligent systems</span>
          </h1>

          <p className="mb-6 font-mono label-sm text-ethereal-on-surface-variant uppercase tracking-wider">
            by Santhosh Sunkara
          </p>

          <h2 className="mb-6 max-w-xl font-display headline-md text-ethereal-on-surface-variant">
            Full Stack Developer & Cloud Engineer focused on AI/ML, Computer Vision, and scalable cloud architectures
          </h2>

          <p className="mb-10 max-w-2xl body-lg text-ethereal-on-surface-variant leading-relaxed">
            B.Tech student in Computer Science Engineering (AI and ML) at KIET. I design intelligent products with Python, OpenCV, and modern ML workflows, turning prototypes into usable experiences.
          </p>

          <div className="mb-10 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="btn-primary group inline-flex items-center gap-2"
            >
              Explore Projects
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="/resume.pdf"
              download="Santhosh_Sunkara_Resume.pdf"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Download size={18} />
              Download Resume
            </a>
            <a
              href="#contact"
              className="btn-ghost group relative inline-flex items-center gap-2"
            >
              <Mail size={18} />
              Contact Me
              <span className="absolute bottom-1 left-2 right-2 h-[2px] origin-left scale-x-0 bg-electric-violet transition-transform group-hover:scale-x-100"></span>
            </a>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="glass-card text-center"
              >
                <p className="font-display text-3xl font-bold text-ethereal-on-surface">{item.value}</p>
                <p className="font-mono label-sm text-ethereal-on-surface-variant uppercase">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="order-1 flex justify-center md:order-2 md:justify-end"
        >
          <div className="relative h-80 w-72 md:h-[30rem] md:w-[25rem]">
            <div className="absolute inset-0 rotate-3 rounded-[2.2rem] border border-electric-violet/20 bg-gradient-to-br from-primary-container/20 to-secondary/10 blur-[1px]"></div>
            <div className="absolute inset-0 z-10 overflow-hidden rounded-[2.2rem] border border-white/15 bg-ethereal-surface p-3 shadow-glass">
              <div className="h-full w-full overflow-hidden rounded-[1.6rem]">
                <img
                  src={profileImg}
                  alt="Santhosh Sunkara - Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-8 top-10 z-20 flex items-center gap-3 rounded-2xl glass px-4 py-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-container/30 text-electric-violet">
                <Brain size={18} />
              </div>
              <div>
                <p className="font-mono label-sm text-ethereal-on-surface-variant">Focus</p>
                <p className="font-display text-sm font-semibold text-ethereal-on-surface">Deep Learning</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -left-10 bottom-24 z-20 flex items-center gap-3 rounded-2xl glass px-4 py-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary-container/30 text-tertiary">
                <Cpu size={18} />
              </div>
              <div>
                <p className="font-mono label-sm text-ethereal-on-surface-variant">Specialty</p>
                <p className="font-display text-sm font-semibold text-ethereal-on-surface">Computer Vision</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;