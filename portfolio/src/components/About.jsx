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
              I am an AI/ML enthusiast with experience in deep learning, computer vision, and real-time AI systems. 
              My passion lies in building intelligent systems and solving real-world problems using cutting-edge machine learning technologies.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed mb-8">
              Currently pursuing a B.Tech in Computer Science Engineering, I'm constantly exploring new architectures, 
              optimizing models, and bridging the gap between theoretical AI and practical, deployable solutions.
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
