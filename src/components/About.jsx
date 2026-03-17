import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { Brain, Code, Cpu, LineChart } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Brain className="text-purple-400" size={24} />,
      title: "Deep Learning",
      description: "Building neural networks for complex pattern recognition"
    },
    {
      icon: <Cpu className="text-blue-400" size={24} />,
      title: "Computer Vision",
      description: "Developing models for image and video analysis"
    },
    {
      icon: <LineChart className="text-green-400" size={24} />,
      title: "Predictive Analytics",
      description: "Creating models to forecast trends and outcomes"
    },
    {
      icon: <Code className="text-indigo-400" size={24} />,
      title: "AI Systems",
      description: "Integrating ML models into full-stack applications"
    }
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <SectionHeading title="About Me" subtitle="Get to know me" />
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-white">
              AI/ML Enthusiast
            </h3>
            <p className="text-lg text-gray-400 leading-relaxed mb-6">
              I am an AI/ML enthusiast with intermediate-level Python expertise and experience in deep learning, computer vision, and real-time AI systems. My recent internships at Google AI-ML and Edunet Foundation have solidified my passion for building intelligent, real-world solutions.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed mb-8">
              Currently pursuing my B.Tech in Computer Science Engineering (AIML) at KIET, I enjoy leveraging tools like OpenCV, MediaPipe, and Generative AI patterns to bridge the gap between theoretical concepts and practical applications.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-1">
                  10+
                </div>
                <div className="text-sm text-gray-400 font-medium">AI Projects</div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 mb-1">
                  4+
                </div>
                <div className="text-sm text-gray-400 font-medium">Frameworks</div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex gap-4 items-start">
                <span className="text-purple-400 font-medium min-w-28 text-sm">Languages</span>
                <span className="text-gray-300 text-sm">English, Telugu, Hindi</span>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-blue-400 font-medium min-w-28 text-sm">Certifications</span>
                <span className="text-gray-300 text-sm">Edunet Foundation, AICTE, Google AIML, Prompt Engineering, Python Full Stack, Basics of Generative AI, Basics of DevOps, Basics of Python</span>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-green-400 font-medium min-w-28 text-sm">Awards</span>
                <span className="text-gray-300 text-sm">Selected for Regional Round at Edunet – Sign Speak: The Silent Communicator</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-gray-900/40 p-6 rounded-2xl border border-gray-800/80 hover:border-purple-500/50 hover:bg-gray-800/60 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-950 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
