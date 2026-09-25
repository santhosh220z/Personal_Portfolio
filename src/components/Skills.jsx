import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { makeReveal, revealViewport } from '../lib/motion';
import TiltCard from './TiltCard';
import { Code2, Cpu, Database, Layout } from 'lucide-react';

const Skills = () => {
  const reduceMotion = useReducedMotion();
  const { container, item } = makeReveal(reduceMotion);

  const skillCategories = [
    {
      title: "Machine Learning & AI",
      Icon: Cpu,
      skills: ["Python", "Machine Learning", "Deep Learning", "Neural Networks", "NLP", "Prompt Engineering", "Generative AI", "Transfer Learning", "Ensemble Methods"],
      iconColor: 'text-electric-violet',
      iconBg: 'bg-accent-soft border-primary-container/30',
    },
    {
      title: "Computer Vision",
      Icon: Layout,
      skills: ["OpenCV", "MediaPipe", "YOLO", "SSD", "Faster R-CNN", "Mask R-CNN", "Object Detection", "Image Segmentation", "Video Analysis", "Gesture Recognition"],
      iconColor: 'text-electric-violet',
      iconBg: 'bg-accent-soft border-accent-line',
    },
    {
      title: "MLOps & Deployment",
      Icon: Code2,
      skills: ["n8n Workflow Automation", "Git", "GitHub Actions", "Docker", "Vertex AI", "API Deployment"],
      iconColor: 'text-electric-violet',
      iconBg: 'bg-accent-soft border-primary-container/30',
    },
    {
      title: "Data Engineering",
      Icon: Database,
      skills: ["Pandas", "NumPy", "Data Preprocessing", "Feature Engineering", "SQL", "Stream Processing", "Airflow"],
      iconColor: 'text-electric-violet',
      iconBg: 'bg-accent-soft border-accent-line',
    }
  ];

  return (
    <section id="skills" className="relative section-spacing">
      <div className="relative z-10 section-container">
        <SectionHeading title="Technical skills" />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="scene-3d grid gap-5 md:grid-cols-2 lg:grid-cols-4"
        >
          {skillCategories.map((category) => (
            <motion.div key={category.title} variants={item}>
              <TiltCard className="surface surface-card-hover h-full">
                <div className="mb-5 flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${category.iconBg}`}>
                    <category.Icon size={19} className={category.iconColor} aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight text-ethereal-on-surface">
                    {category.title}
                  </h3>
                </div>

                <ul className="flex list-none flex-wrap gap-1.5 p-0">
                  {category.skills.map((skill) => (
                    <li key={skill} className="chip">
                      {skill}
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;