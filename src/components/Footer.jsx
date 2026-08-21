import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-ethereal-surface/40 pt-16 pb-8 backdrop-blur-glass">
      <div className="section-container">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-electric-violet/30 bg-gradient-to-br from-primary-container/20 to-secondary/20">
              <span className="font-display text-xs font-black text-ethereal-on-surface">SS</span>
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-ethereal-on-surface">
              Santhosh Sunkara
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a href="https://github.com/santhosh220z" target="_blank" rel="noreferrer" className="rounded-full glass p-2 text-ethereal-on-surface-variant transition-all hover:text-electric-violet">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/siva-sambhavi-santhosh-sunkara-588a24265/" target="_blank" rel="noreferrer" className="rounded-full glass p-2 text-ethereal-on-surface-variant transition-all hover:text-electric-violet">
              <Linkedin size={20} />
            </a>
            <a href="mailto:santhoshsunkarasbe@gmail.com" className="rounded-full glass p-2 text-ethereal-on-surface-variant transition-all hover:text-electric-violet">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-ethereal-on-surface-variant md:flex-row">
          <p>© {currentYear} Santhosh Sunkara. All rights reserved.</p>
          <p className="font-mono label-sm tracking-wider uppercase">Designed and built with React</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;