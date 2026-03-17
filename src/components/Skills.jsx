import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { Code2, Cpu, Database, Layout, Terminal } from 'lucide-react';

const Skills = () => {
  const skillCategories = [
    {
      title: "AI & Machine Learning",
      icon: <Cpu className="text-purple-400" size={24} />,
      skills: ["Python", "Machine Learning", "Generative AI", "Prompt Engineering", "Deep Learning", "Predictive Analytics"],
      color: "purple"
    },
    {
      title: "Computer Vision",
      icon: <Layout className="text-blue-400" size={24} />,
      skills: ["OpenCV", "MediaPipe", "YOLO", "SSD", "Video Analysis", "Gesture Recognition"],
      color: "blue"
    },
    {
      title: "Tools & Automation",
      icon: <Code2 className="text-green-400" size={24} />,
      skills: ["n8n Workflow Automation", "Git", "GitHub", "VS Code", "Jupyter Notebook"],
      color: "green"
    },
    {
      title: "Web Development",
      icon: <Database className="text-pink-400" size={24} />,
      skills: ["HTML", "CSS", "Frontend (Intermediate)", "React"],
      color: "pink"
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
    <section id="skills" className="py-24 relative bg-gray-900/20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <SectionHeading title="Technical Skills" subtitle="My Toolkit" />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillCategories.map((category, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`bg-gray-900/60 p-6 rounded-2xl border border-gray-800 hover:border-${category.color}-500/50 transition-colors backdrop-blur-sm shadow-xl`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl bg-${category.color}-500/10 border border-${category.color}-500/20`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{category.title}</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-3 py-1.5 bg-gray-950 border border-gray-800 text-gray-300 text-sm font-medium rounded-lg hover:text-white hover:border-gray-600 transition-colors"
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
