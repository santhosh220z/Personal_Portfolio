import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Send, MapPin, Phone } from 'lucide-react';
import SectionHeading from './SectionHeading';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success state after a few seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full flex flex-col items-center">
        <SectionHeading title="Get In Touch" subtitle="Contact Me" />
        
        <div className="w-full max-w-5xl grid md:grid-cols-5 gap-12 mt-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 flex flex-col gap-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Let's connect</h3>
              <p className="text-gray-400 leading-relaxed">
                I'm currently looking for new opportunities in AI/ML engineering, research roles, 
                and software development. Whether you have a question or just want to say hi, 
                I'll try my best to get back to you!
              </p>
            </div>
            
            <div className="flex flex-col gap-6">
              <a href="mailto:contact@example.com" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                  <Mail className="text-purple-400" size={24} />
                </div>
                <div>
                  <div className="text-sm text-gray-400 font-medium">Email</div>
                  <div className="text-white font-medium group-hover:text-purple-300 transition-colors">contact@example.com</div>
                </div>
              </a>
              
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                  <Linkedin className="text-blue-400" size={24} />
                </div>
                <div>
                  <div className="text-sm text-gray-400 font-medium">LinkedIn</div>
                  <div className="text-white font-medium group-hover:text-blue-300 transition-colors">Santhosh Sunkara</div>
                </div>
              </a>
              
              <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-gray-600/10 flex items-center justify-center border border-gray-600/20 group-hover:bg-gray-600/20 transition-colors">
                  <Github className="text-gray-400" size={24} />
                </div>
                <div>
                  <div className="text-sm text-gray-400 font-medium">GitHub</div>
                  <div className="text-white font-medium group-hover:text-gray-300 transition-colors">@githubusername</div>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-3 bg-gray-900/60 p-8 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden"
          >
            {/* Background glowing orb */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-400">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-400">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-400">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
                  placeholder="Hello Santhosh, I'd like to discuss a project..."
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 shadow-lg shadow-purple-500/20"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isSubmitted ? (
                  <>Message Sent Successfully! <span className="text-green-300">✓</span></>
                ) : (
                  <>Send Message <Send size={18} /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
