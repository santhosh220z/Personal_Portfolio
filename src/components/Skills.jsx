import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { Code2, Cpu, Database, Layout } from 'lucide-react';

const Skills = () => {
  const skillCategories = [
    {
      title: "Machine Learning & AI",
      Icon: Cpu,
      skills: ["Python", "Machine Learning", "Deep Learning", "Neural Networks", "NLP", "Prompt Engineering", "Generative AI", "Transfer Learning", "Ensemble Methods"],
      iconColor: 'text-electric-violet',
      iconBg: 'bg-primary-container/20 border-primary-container/30',
    },
    {
      title: "Computer Vision",
      Icon: Layout,
      skills: ["OpenCV", "MediaPipe", "YOLO", "SSD", "Faster R-CNN", "Mask R-CNN", "Object Detection", "Image Segmentation", "Video Analysis", "Gesture Recognition"],
      iconColor: 'text-tertiary',
      iconBg: 'bg-tertiary-container/20 border-tertiary/30',
    },
    {
      title: "MLOps & Deployment",
      Icon: Code2,
      skills: ["n8n Workflow Automation", "Git", "GitHub Actions", "Docker", "Vertex AI", "API Deployment"],
      iconColor: 'text-electric-violet',
      iconBg: 'bg-primary-container/20 border-primary-container/30',
    },
    {
      title: "Data Engineering",
      Icon: Database,
      skills: ["Pandas", "NumPy", "Data Preprocessing", "Feature Engineering", "SQL", "Stream Processing", "Airflow"],
      iconColor: 'text-tertiary',
      iconBg: 'bg-tertiary-container/20 border-tertiary/30',
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="skills" className="relative section-spacing">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric-violet/5 blur-[120px]"></div>

      <div className="relative z-10 section-container">
        <SectionHeading title="Technical Skills" subtitle="My Toolkit" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {skillCategories.map((category, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="glass-card-hover"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`rounded-xl border p-3 ${category.iconBg}`}>
                  <category.Icon size={22} className={category.iconColor} />
                </div>
                <h3 className="font-display headline-sm text-ethereal-on-surface">{category.title}</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="chip hover:chip-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;