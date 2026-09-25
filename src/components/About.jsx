import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { makeReveal, revealViewport } from '../lib/motion';
import { Brain, Code, Cpu, LineChart } from 'lucide-react';

const About = () => {
  const reduceMotion = useReducedMotion();
  const { container, item } = makeReveal(reduceMotion);
  const features = [
    {
      Icon: Brain,
      title: "Deep Learning",
      description: "Building robust neural networks for practical pattern recognition.",
      color: 'text-electric-violet',
      bg: 'bg-accent-soft border-primary-container/30'
    },
    {
      Icon: Cpu,
      title: "Computer Vision",
      description: "Designing image and video intelligence pipelines with measurable impact.",
      color: 'text-electric-violet',
      bg: 'bg-accent-soft border-accent-line'
    },
    {
      Icon: LineChart,
      title: "Predictive Analytics",
      description: "Transforming datasets into forecasts and decision-ready insights.",
      color: 'text-electric-violet',
      bg: 'bg-secondary-container/20 border-secondary/30'
    },
    {
      Icon: Code,
      title: "AI Systems",
      description: "Serving models behind an API with the frontend on top.",
      color: 'text-electric-violet',
      bg: 'bg-accent-soft border-accent-line'
    }
  ];

  return (
    <section id="about" className="relative section-spacing">
      <div className="relative z-10 section-container">
        <SectionHeading title="About Me" eyebrow="Profile" />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="grid items-start gap-10 lg:grid-cols-[1.15fr_1fr]"
        >
          <motion.div
            variants={item}
            className="rounded-2xl surface surface-card p-8 md:p-10"
          >
            <h3 className="mb-4 font-display text-2xl text-ethereal-on-surface">
              Applied ML engineer, product-minded
            </h3>
            <p className="text-base text-ethereal-on-surface-variant leading-relaxed">
              I build vision and language systems that hold up outside a notebook:
              real-time gesture recognition, deepfake detection, and predictive
              health models. My internships at Google's AI-ML programme and the
              Edunet Foundation took me from model prototypes to deployed systems.
            </p>
            <p className="mb-8 text-lg text-ethereal-on-surface-variant leading-relaxed">
              Currently pursuing my B.Tech in Computer Science Engineering (AIML) at KIET, I enjoy leveraging tools like OpenCV, MediaPipe, and Generative AI patterns to bridge the gap between theoretical concepts and practical applications.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="surface surface-card text-center">
                <div className="mb-1 text-gradient text-3xl font-bold">10+</div>
                <div className="font-mono text-xs text-ethereal-on-surface-variant">AI Projects</div>
              </div>
              <div className="surface surface-card text-center">
                <div className="mb-1 text-gradient text-3xl font-bold">4+</div>
                <div className="font-mono text-xs text-ethereal-on-surface-variant">Frameworks</div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex gap-4 items-start">
                <span className="min-w-28 font-mono text-xs text-electric-violet">Languages</span>
                <span className="text-base text-ethereal-on-surface-variant">English, Telugu, Hindi</span>
              </div>
              <div className="flex gap-4 items-start">
                <span className="min-w-28 font-mono text-xs text-electric-violet">Certifications</span>
                <span className="text-base text-ethereal-on-surface-variant">Edunet Foundation, AICTE, Google AIML, Prompt Engineering, Python Full Stack, Basics of Generative AI, Basics of DevOps, Basics of Python</span>
              </div>
              <div className="flex gap-4 items-start">
                <span className="min-w-28 font-mono text-xs text-electric-violet">Awards</span>
                <span className="text-base text-ethereal-on-surface-variant">Selected for Regional Round at Edunet - Sign Speak: The Silent Communicator</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={item}
                whileHover={{ y: -5 }}
                className="group surface surface-card-hover"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border transition-transform group-hover:scale-110 ${feature.bg}`}>
                  <feature.Icon size={22} className={feature.color} />
                </div>
                <h4 className="mb-2 font-display text-lg text-ethereal-on-surface">{feature.title}</h4>
                <p className="text-base text-ethereal-on-surface-variant leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;