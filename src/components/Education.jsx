import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, BookOpen } from 'lucide-react';
import SectionHeading from './SectionHeading';

const Education = () => {
  const educationData = [
    {
      degree: "Bachelor of Technology (B.Tech)",
      major: "Computer Science Engineering (AIML)",
      institution: "Kakinada Institute of Engineering and Technology – II, Kakinada",
      period: "2022 - 2026",
      details: "CGPA: 7.44. Specialized in Artificial Intelligence, Machine Learning and deep neural networks.",
      courses: ["Artificial Intelligence", "Machine Learning", "Data Structures", "Algorithms", "Computer Vision"]
    },
    {
      degree: "Intermediate – MPC",
      major: "Maths, Physics, Chemistry",
      institution: "GRC Modern Junior College, Ramachandrapuram",
      period: "2020 - 2022",
      details: "Focused on core science and mathematics subjects.",
      courses: ["Mathematics", "Physics", "Chemistry"]
    },
    {
      degree: "Secondary School Certificate (SSC)",
      major: "General Studies",
      institution: "Zilla Praja Parishad High School, Draksharama",
      period: "2019 - 2020",
      details: "Completed secondary education with strong academic performance.",
      courses: []
    }
  ];

  return (
    <section id="education" className="py-24 relative bg-gray-900/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full flex flex-col items-center">
        <SectionHeading title="Education" subtitle="Academic Background" />
        
        <div className="w-full max-w-3xl flex flex-col gap-8">
          {educationData.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative bg-gray-900/60 p-8 md:p-10 rounded-3xl border border-gray-800 overflow-hidden group shadow-xl"
            >
              {/* Background glowing effect */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
              
              <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                <div className="flex-shrink-0 p-4 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-2xl">
                  {index === 0 ? <GraduationCap size={40} className="text-purple-400" /> : <BookOpen size={40} className="text-purple-400" />}
                </div>
                
                <div className="flex-1 w-full">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{edu.degree}</h3>
                      <h4 className="text-xl text-purple-300 font-medium mb-1">{edu.major}</h4>
                      <p className="text-gray-400 text-sm">{edu.institution}</p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/80 border border-gray-700 w-fit text-sm text-gray-300 font-medium whitespace-nowrap">
                      <Calendar size={16} className="text-purple-400" />
                      {edu.period}
                    </div>
                  </div>
                  
                  <p className="text-gray-400 leading-relaxed max-w-2xl mb-6">
                    {edu.details}
                  </p>
                  
                  {edu.courses.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {edu.courses.map((course, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-800/50 rounded-md text-sm text-gray-400 text-center border border-gray-800/80">
                          {course}
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

export default Education;
