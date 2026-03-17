import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';
import SectionHeading from './SectionHeading';

const Experience = () => {
  const experiences = [
    {
      role: "Google AI-ML Virtual Internship",
      company: "Google",
      period: "2024 - 2025",
      description: "Completed an immersive virtual internship focused on Artificial Intelligence and Machine Learning concepts, algorithms, and real-world applications.",
      skills: ["Artificial Intelligence", "Machine Learning", "Algorithms"]
    },
    {
      role: "Intern",
      company: "Edunet Foundation",
      period: "2024 - 2025",
      description: "Developed a real-time hand sign recognition system using Python, OpenCV, and Mediapipe to improve gesture interpretation and communication accessibility.",
      skills: ["Python", "OpenCV", "Mediapipe", "Computer Vision"]
    }
  ];

  return (
    <section id="experience" className="py-24 relative relative z-10 w-full flex flex-col items-center">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full flex flex-col items-center">
        <SectionHeading title="Experience" subtitle="Professional Journey" />
        
        <div className="w-full max-w-3xl flex flex-col gap-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative bg-gray-900/60 p-8 md:p-10 rounded-3xl border border-gray-800 overflow-hidden group shadow-xl"
            >
              {/* Background glowing effect */}
              <div className="absolute -left-20 -top-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
              
              <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                <div className="flex-shrink-0 p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl">
                  <Briefcase size={40} className="text-blue-400" />
                </div>
                
                <div className="flex-1 w-full">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{exp.role}</h3>
                      <h4 className="text-xl text-blue-300 font-medium mb-1">{exp.company}</h4>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/80 border border-gray-700 w-fit text-sm text-gray-300 font-medium whitespace-nowrap">
                      <Calendar size={16} className="text-blue-400" />
                      {exp.period}
                    </div>
                  </div>
                  
                  <p className="text-gray-400 leading-relaxed max-w-2xl mb-6">
                    {exp.description}
                  </p>
                  
                  {exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {exp.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-800/50 rounded-md text-sm text-gray-400 text-center border border-gray-800/80">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
