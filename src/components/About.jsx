import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { Brain, Code, Cpu, LineChart } from 'lucide-react';

const About = () => {
  const features = [
    {
      Icon: Brain,
      title: "Deep Learning",
      description: "Building robust neural networks for practical pattern recognition.",
      color: 'text-electric-violet',
      bg: 'bg-primary-container/20 border-primary-container/30'
    },
    {
      Icon: Cpu,
      title: "Computer Vision",
      description: "Designing image and video intelligence pipelines with measurable impact.",
      color: 'text-tertiary',
      bg: 'bg-tertiary-container/20 border-tertiary/30'
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
      description: "Shipping full-stack products with integrated machine learning workflows.",
      color: 'text-tertiary',
      bg: 'bg-tertiary-container/20 border-tertiary/30'
    }
  ];

  return (
    <section id="about" className="relative section-spacing">
      <div className="relative z-10 section-container">
        <SectionHeading title="About Me" subtitle="Profile" />

        <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_1fr]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl glass-card p-8 md:p-10"
          >
            <h3 className="mb-4 font-display headline-md text-ethereal-on-surface">
              AI and ML enthusiast with a product mindset
            </h3>
            <p className="mb-6 body-lg text-ethereal-on-surface-variant leading-relaxed">
              I am an AI/ML enthusiast with intermediate-level Python expertise and experience in deep learning, computer vision, and real-time AI systems. My recent internships at Google AI-ML and Edunet Foundation have solidified my passion for building intelligent, real-world solutions.
            </p>
            <p className="mb-8 body-lg text-ethereal-on-surface-variant leading-relaxed">
              Currently pursuing my B.Tech in Computer Science Engineering (AIML) at KIET, I enjoy leveraging tools like OpenCV, MediaPipe, and Generative AI patterns to bridge the gap between theoretical concepts and practical applications.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card text-center">
                <div className="mb-1 text-gradient text-3xl font-bold">10+</div>
                <div className="font-mono label-sm text-ethereal-on-surface-variant">AI Projects</div>
              </div>
              <div className="glass-card text-center">
                <div className="mb-1 text-gradient text-3xl font-bold">4+</div>
                <div className="font-mono label-sm text-ethereal-on-surface-variant">Frameworks</div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex gap-4 items-start">
                <span className="min-w-28 font-mono label-sm text-electric-violet">Languages</span>
                <span className="body-md text-ethereal-on-surface-variant">English, Telugu, Hindi</span>
              </div>
              <div className="flex gap-4 items-start">
                <span className="min-w-28 font-mono label-sm text-tertiary">Certifications</span>
                <span className="body-md text-ethereal-on-surface-variant">Edunet Foundation, AICTE, Google AIML, Prompt Engineering, Python Full Stack, Basics of Generative AI, Basics of DevOps, Basics of Python</span>
              </div>
              <div className="flex gap-4 items-start">
                <span className="min-w-28 font-mono label-sm text-electric-violet">Awards</span>
                <span className="body-md text-ethereal-on-surface-variant">Selected for Regional Round at Edunet - Sign Speak: The Silent Communicator</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="group glass-card-hover"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border transition-transform group-hover:scale-110 ${feature.bg}`}>
                  <feature.Icon size={22} className={feature.color} />
                </div>
                <h4 className="mb-2 font-display headline-sm text-ethereal-on-surface">{feature.title}</h4>
                <p className="body-md text-ethereal-on-surface-variant leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;