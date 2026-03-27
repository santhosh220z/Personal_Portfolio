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
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-chlorophyll-surface-highest/60 backdrop-blur-[16px] border-b border-chlorophyll-tertiary/5 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="#" className="font-display text-xl font-bold tracking-tighter text-chlorophyll-on-surface flex items-center gap-2">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 10 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-chlorophyll-primary to-chlorophyll-primary-container flex items-center justify-center shadow-[0_0_40px_rgba(175,209,136,0.3)]"
          >
            <span className="text-chlorophyll-on-primary font-black text-sm">AI</span>
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
                  className="font-body text-sm font-medium text-chlorophyll-on-surface-variant hover:text-chlorophyll-primary transition-colors duration-200"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center gap-4 pl-6 border-l border-chlorophyll-outline-variant/30">
            <a href="https://github.com/santhosh220z" target="_blank" rel="noreferrer" className="text-chlorophyll-on-surface-variant hover:text-chlorophyll-primary transition-colors">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/siva-sambhavi-santhosh-sunkara-588a24265/" target="_blank" rel="noreferrer" className="text-chlorophyll-on-surface-variant hover:text-chlorophyll-primary transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden text-chlorophyll-on-surface-variant focus:outline-none"
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
            className="md:hidden bg-chlorophyll-surface-low border-b border-chlorophyll-outline-variant/30 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-body text-base font-medium text-chlorophyll-on-surface-variant hover:text-chlorophyll-primary py-2"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t border-chlorophyll-outline-variant/30">
                <a href="https://github.com/santhosh220z" className="text-chlorophyll-on-surface-variant hover:text-chlorophyll-primary">
                  <Github size={20} />
                </a>
                <a href="https://www.linkedin.com/in/siva-sambhavi-santhosh-sunkara-588a24265/" className="text-chlorophyll-on-surface-variant hover:text-chlorophyll-primary">
                  <Linkedin size={20} />
                </a>
                <a href="mailto:santhoshsunkarasbe@gmail.com" className="text-chlorophyll-on-surface-variant hover:text-chlorophyll-primary">
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
