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
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Hand Gesture Recognition",
      description: "Real-time gesture recognition system using MediaPipe and TensorFlow to classify hand gestures from live camera input.",
      technologies: ["Python", "OpenCV", "MediaPipe", "TensorFlow"],
      github: "https://github.com/santhosh220z",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "AI Chatbot using DeepSeek-R1",
      description: "AI chatbot using the DeepSeek-R1 model from Hugging Face with conversation history and web interface.",
      technologies: ["Python", "Hugging Face", "HTML", "CSS"],
      github: "https://github.com/santhosh220z",
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Stroke Prediction System",
      description: "Machine learning model predicting stroke risk based on medical dataset features using classification algorithms.",
      technologies: ["Python", "Scikit-learn"],
      github: "https://github.com/santhosh220z",
      color: "from-rose-500 to-pink-500"
    }
  ];

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <SectionHeading title="Featured Projects" subtitle="My Work" />
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 pt-8">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
              className={`group relative bg-chlorophyll-surface-highest/60 backdrop-blur-[16px] rounded-2xl overflow-hidden border border-chlorophyll-tertiary/5 hover:border-chlorophyll-primary/30 hover:shadow-[0_0_40px_rgba(175,209,136,0.15)] transition-all flex flex-col ${idx % 2 !== 0 ? 'md:mt-16' : ''}`}
            >
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-10">
                  <div className="p-4 bg-chlorophyll-surface-low rounded-xl group-hover:bg-chlorophyll-primary-container/20 group-hover:text-chlorophyll-primary transition-colors">
                    <Code2 className="text-chlorophyll-on-surface-variant group-hover:text-chlorophyll-primary transition-colors" size={26} />
                  </div>
                  <div className="flex gap-4 text-chlorophyll-outline-variant">
                    <a href={project.github} target="_blank" rel="noreferrer" className="hover:text-chlorophyll-primary transition-colors">
                      <Github size={22} />
                    </a>
                  </div>
                </div>

                <h3 className="font-display text-2xl md:text-3xl font-bold text-chlorophyll-on-surface mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-chlorophyll-primary group-hover:to-chlorophyll-tertiary transition-all">
                  {project.title}
                </h3>
                
                <p className="font-body text-chlorophyll-on-surface-variant mb-12 leading-relaxed flex-1">
                  {project.description}
                </p>

                {/* Asymmetrical Data Metric approach */}
                <div className="flex justify-between items-end mt-auto">
                  <div className="flex flex-wrap gap-2 max-w-[70%]">
                    {project.technologies.map((tech, techIdx) => (
                      <span 
                        key={techIdx} 
                        className="font-body text-xs font-semibold px-3 py-1 bg-chlorophyll-secondary-container text-chlorophyll-on-secondary-container rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="text-chlorophyll-outline-variant group-hover:text-chlorophyll-primary-container transition-colors opacity-30 group-hover:opacity-100 flex items-center">
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
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-chlorophyll-surface-variant/20 backdrop-blur-md border border-chlorophyll-tertiary/10 text-chlorophyll-on-surface font-medium hover:bg-chlorophyll-surface-variant/40 hover:border-chlorophyll-primary/30 transition-all font-display"
          >
            View more on GitHub <Github size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
