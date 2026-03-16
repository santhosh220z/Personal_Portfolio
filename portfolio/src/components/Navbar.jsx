import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50 py-3 shadow-lg shadow-black/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="#" className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 10 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30"
          >
            <span className="text-slate-50 font-black text-sm">AI</span>
          </motion.div>
          Santhosh
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center gap-4 pl-6 border-l border-gray-800">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden text-gray-300 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-950 border-b border-gray-800 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-gray-300 hover:text-white py-2"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
                <a href="https://github.com" className="text-gray-400 hover:text-white">
                  <Github size={20} />
                </a>
                <a href="https://linkedin.com" className="text-gray-400 hover:text-white">
                  <Linkedin size={20} />
                </a>
                <a href="mailto:contact@example.com" className="text-gray-400 hover:text-white">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
