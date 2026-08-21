import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Code2 } from 'lucide-react';
import SectionHeading from './SectionHeading';

const Projects = () => {
  const projects = [
    {
      title: "Deepfake Detection Model",
      description: "Deep learning model to detect manipulated videos and images using CNN architecture and image preprocessing techniques.",
      technologies: ["Python", "TensorFlow", "OpenCV"],
      github: "https://github.com/santhosh220z/Deepfake-Detection",
      impact: "Computer Vision"
    },
    {
      title: "Hand Gesture Recognition",
      description: "Real-time gesture recognition system using MediaPipe and TensorFlow to classify hand gestures from live camera input.",
      technologies: ["Python", "OpenCV", "MediaPipe", "TensorFlow"],
      github: "https://github.com/santhosh220z",
      impact: "Assistive AI"
    },
    {
      title: "AI Chatbot using DeepSeek-R1",
      description: "AI chatbot using the DeepSeek-R1 model from Hugging Face with conversation history and web interface.",
      technologies: ["Python", "Hugging Face", "HTML", "CSS"],
      github: "https://github.com/santhosh220z",
      impact: "Generative AI"
    },
    {
      title: "Stroke Prediction System",
      description: "Machine learning model predicting stroke risk based on medical dataset features using classification algorithms.",
      technologies: ["Python", "Scikit-learn"],
      github: "https://github.com/santhosh220z",
      impact: "Healthcare ML"
    }
  ];

  return (
    <section id="projects" className="relative section-spacing">
      <div className="relative z-10 section-container">
        <SectionHeading title="Featured Projects" subtitle="My Work" />

        <div className="grid gap-8 pt-8 md:grid-cols-2 md:gap-10">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
              className={`group relative flex flex-col overflow-hidden rounded-2xl glass-card-hover ${idx % 2 !== 0 ? 'md:mt-14' : ''}`}
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-electric-violet via-tertiary to-secondary"></div>
              <div className="flex flex-1 flex-col p-8">
                <div className="mb-8 flex items-start justify-between">
                  <div className="rounded-xl border border-electric-violet/30 bg-primary-container/20 p-3 text-electric-violet transition-colors group-hover:bg-primary-container/30">
                    <Code2 size={24} />
                  </div>

                  <div className="flex items-center gap-3 text-ethereal-on-surface-variant">
                    <span className="chip-primary">
                      {project.impact}
                    </span>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg glass p-2 transition-colors hover:text-electric-violet"
                    >
                      <Github size={22} />
                    </a>
                  </div>
                </div>

                <h3 className="mb-4 font-display headline-sm text-ethereal-on-surface transition-all group-hover:text-gradient md:headline-md">
                  {project.title}
                </h3>

                <p className="mb-10 flex-1 body-lg text-ethereal-on-surface-variant leading-relaxed">
                  {project.description}
                </p>

                <div className="mt-auto flex items-end justify-between">
                  <div className="flex max-w-[74%] flex-wrap gap-2">
                    {project.technologies.map((tech, techIdx) => (
                      <span
                        key={techIdx}
                        className="chip"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center text-ethereal-on-surface-variant/50 transition-colors group-hover:text-electric-violet group-hover:opacity-100">
                    <ExternalLink size={24} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-20">
          <a
            href="https://github.com/santhosh220z"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
          >
            View more on GitHub <Github size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;