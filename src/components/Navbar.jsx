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
    <nav className="fixed inset-x-0 top-4 z-50 px-3 md:top-6 md:px-8">
      <div
        className={`mx-auto flex w-full max-w-7xl items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-300 md:px-6 ${
          isScrolled
            ? 'glass-hover'
            : 'glass'
        }`}
      >
        <a href="#hero" className="group flex items-center gap-3">
          <motion.div
            initial={{ rotate: -6 }}
            animate={{ rotate: 6 }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2.6 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-electric-violet/30 bg-gradient-to-br from-electric-violet/20 via-primary-container/20 to-secondary/20"
          >
            <span className="font-display text-xs font-extrabold tracking-wide text-ethereal-on-surface">SS</span>
          </motion.div>
          <div>
            <p className="font-display text-base font-semibold text-ethereal-on-surface">Santhosh Sunkara</p>
            <p className="text-xs tracking-[0.18em] text-ethereal-on-surface-variant font-mono uppercase">Machine Learning</p>
          </div>
        </a>

        <div className="hidden items-center gap-3 lg:flex">
          <ul className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="rounded-full px-3 py-2 text-sm font-medium text-ethereal-on-surface-variant transition-all duration-200 hover:bg-white/10 hover:text-ethereal-on-surface font-mono label-sm"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="ml-1 flex items-center gap-2">
            <a
              href="https://github.com/santhosh220z"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 bg-white/5 p-2 text-ethereal-on-surface-variant transition-colors hover:text-electric-violet hover:border-white/30"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/siva-sambhavi-santhosh-sunkara-588a24265/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 bg-white/5 p-2 text-ethereal-on-surface-variant transition-colors hover:text-electric-violet hover:border-white/30"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        <button
          className="rounded-xl border border-white/15 bg-white/5 p-2 text-ethereal-on-surface-variant transition-colors hover:text-electric-violet lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto mt-2 w-full max-w-7xl overflow-hidden rounded-2xl glass p-5 lg:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-ethereal-on-surface-variant transition-all hover:bg-white/10 hover:text-ethereal-on-surface font-mono label-sm"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-white/15 pt-4">
              <a
                href="https://github.com/santhosh220z"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-ethereal-on-surface-variant transition-colors hover:text-electric-violet"
              >
                <Github size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/siva-sambhavi-santhosh-sunkara-588a24265/"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-ethereal-on-surface-variant transition-colors hover:text-electric-violet"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="mailto:santhoshsunkarasbe@gmail.com"
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-ethereal-on-surface-variant transition-colors hover:text-electric-violet"
              >
                <Mail size={18} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;