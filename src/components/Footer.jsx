import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-800/60 bg-gray-950/50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-slate-50 font-black text-sm">AI</span>
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">
              Santhosh Sunkara
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://github.com/santhosh220z" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/siva-sambhavi-santhosh-sunkara-588a24265/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full">
              <Linkedin size={20} />
            </a>
            <a href="mailto:santhoshsunkarasbe@gmail.com" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800/60 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {currentYear} Santhosh Sunkara. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
