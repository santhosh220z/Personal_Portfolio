import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Mail } from 'lucide-react';
import profileImg from '../assets/profile2.jpeg';

const Hero = () => {
  return (
    <section id="hero" className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid md:grid-cols-2 gap-12 items-center z-10">
        
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="order-2 md:order-1 flex flex-col items-start"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-6 backdrop-blur-sm flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Available for opportunities
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-white">
            Hi, I'm <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
              Santhosh Sunkara
            </span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-medium text-gray-300 mb-6">
            AI / Machine Learning Developer
          </h2>
          
          <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-xl">
            B.Tech student specializing in Computer Science Engineering (AI & ML) at Kakinada Institute of Engineering and Technology. 
            Python enthusiast at an intermediate level with a strong interest in Machine Learning, Generative AI, and building real-world AI applications.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="px-6 py-3 rounded-xl bg-white text-gray-950 font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              View Projects <ArrowRight size={18} />
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Download size={18} /> Resume
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-300 font-medium hover:bg-purple-600/20 transition-colors flex items-center gap-2"
            >
              <Mail size={18} /> Contact Me
            </a>
          </div>
        </motion.div>

        {/* Profile Image / Graphics */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="order-1 md:order-2 flex justify-center md:justify-end"
        >
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 border border-white/10 backdrop-blur-3xl transform rotate-6 transition-transform hover:rotate-12 duration-500"></div>
            <div className="absolute inset-0 rounded-3xl bg-gray-900 border border-gray-800 flex items-center justify-center overflow-hidden shadow-2xl z-10">
              {/* Profile Image */}
              <div className="w-full h-full p-2">
                <img 
                  src={profileImg} 
                  alt="Santhosh Sunkara - Profile" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            
            {/* Floating badges */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-6 top-10 bg-gray-900 border border-gray-800 p-3 rounded-2xl shadow-xl z-20 flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mb-1">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-white">Deep Learning</span>
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -left-8 bottom-20 bg-gray-900 border border-gray-800 p-3 rounded-2xl shadow-xl z-20 flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mb-1">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-white">Computer Vision</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
