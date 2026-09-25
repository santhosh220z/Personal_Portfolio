import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-ethereal-surface/60 pt-16 pb-8">
      <div className="section-container">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent-line bg-gradient-to-br from-primary-container/20 to-accent/20">
              <span className="font-display text-xs font-black text-ethereal-on-surface">SS</span>
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-ethereal-on-surface">
              Santhosh Sunkara
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a href="https://github.com/santhosh220z" target="_blank" rel="noreferrer" aria-label="GitHub" className="icon-btn">
              <Github size={20} aria-hidden="true" />
            </a>
            <a href="https://www.linkedin.com/in/siva-sambhavi-santhosh-sunkara-588a24265/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="icon-btn">
              <Linkedin size={20} aria-hidden="true" />
            </a>
            <a href="mailto:santhoshsunkarasbe@gmail.com" aria-label="Email" className="icon-btn">
              <Mail size={20} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-8 text-sm text-ethereal-on-surface-variant md:flex-row">
          <p>© {currentYear} Santhosh Sunkara. All rights reserved.</p>
          <p className="font-mono text-xs tracking-wider uppercase">Designed and built with React</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;