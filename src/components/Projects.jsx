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
      github: "https://github.com",
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Hand Gesture Recognition",
      description: "Real-time gesture recognition system using MediaPipe and TensorFlow to classify hand gestures from live camera input.",
      technologies: ["Python", "OpenCV", "MediaPipe", "TensorFlow"],
      github: "https://github.com",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "AI Chatbot using DeepSeek-R1",
      description: "AI chatbot using the DeepSeek-R1 model from Hugging Face with conversation history and web interface.",
      technologies: ["Python", "Hugging Face", "HTML", "CSS"],
      github: "https://github.com",
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Stroke Prediction System",
      description: "Machine learning model predicting stroke risk based on medical dataset features using classification algorithms.",
      technologies: ["Python", "Scikit-learn"],
      github: "https://github.com",
      color: "from-rose-500 to-pink-500"
    }
  ];

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <SectionHeading title="Featured Projects" subtitle="My Work" />
        
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all"
            >
              {/* Top accent line */}
              <div className={`h-1 w-full bg-gradient-to-r ${project.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-gray-800/50 rounded-xl group-hover:bg-gray-800 transition-colors">
                    <Code2 className="text-gray-400 group-hover:text-white transition-colors" size={24} />
                  </div>
                  <div className="flex gap-3 text-gray-400">
                    <a href={project.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                      <Github size={20} />
                    </a>
                    <a href="#" className="hover:text-white transition-colors">
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                  {project.title}
                </h3>
                
                <p className="text-gray-400 mb-8 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.technologies.map((tech, techIdx) => (
                    <span 
                      key={techIdx} 
                      className="text-xs font-medium px-2.5 py-1 bg-gray-800/50 text-gray-300 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white font-medium hover:bg-gray-800 transition-colors"
          >
            View more on GitHub <Github size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
