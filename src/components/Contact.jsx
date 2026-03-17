import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin } from 'lucide-react';
import SectionHeading from './SectionHeading';

const Contact = () => {
  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full flex flex-col items-center">
        <SectionHeading title="Get In Touch" subtitle="Contact Me" />
        
        <div className="w-full max-w-4xl mt-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-10 items-center text-center"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Let's connect</h3>
              <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
                I'm currently looking for new opportunities in AI/ML engineering, research roles, 
                and software development. Whether you have a question or just want to say hi, 
                I'll try my best to get back to you!
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 w-full">
              <a href="mailto:contact@example.com" className="flex flex-col items-center gap-4 group p-8 bg-gray-900/50 rounded-3xl border border-gray-800 hover:border-purple-500/50 hover:bg-gray-800/80 transition-all flex-1 min-w-[200px] shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                  <Mail className="text-purple-400" size={28} />
                </div>
                <div>
                  <div className="text-sm text-gray-400 font-medium mb-1">Email</div>
                  <div className="text-white font-medium group-hover:text-purple-300 transition-colors">contact@example.com</div>
                </div>
              </a>
              
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-4 group p-8 bg-gray-900/50 rounded-3xl border border-gray-800 hover:border-blue-500/50 hover:bg-gray-800/80 transition-all flex-1 min-w-[200px] shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                  <Linkedin className="text-blue-400" size={28} />
                </div>
                <div>
                  <div className="text-sm text-gray-400 font-medium mb-1">LinkedIn</div>
                  <div className="text-white font-medium group-hover:text-blue-300 transition-colors">Santhosh Sunkara</div>
                </div>
              </a>
              
              <a href="https://github.com" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-4 group p-8 bg-gray-900/50 rounded-3xl border border-gray-800 hover:border-gray-500/50 hover:bg-gray-800/80 transition-all flex-1 min-w-[200px] shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-gray-600/10 flex items-center justify-center border border-gray-600/20 group-hover:bg-gray-600/20 transition-colors">
                  <Github className="text-gray-400" size={28} />
                </div>
                <div>
                  <div className="text-sm text-gray-400 font-medium mb-1">GitHub</div>
                  <div className="text-white font-medium group-hover:text-gray-300 transition-colors">@githubusername</div>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
