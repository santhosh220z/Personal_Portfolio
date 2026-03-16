import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Hero from './components/Hero';

import About from './components/About';
import Skills from './components/Skills';

import Projects from './components/Projects';
import Education from './components/Education';
import Contact from './components/Contact';
function App() {
  return (
    <div className="bg-gray-950 min-h-screen text-gray-200">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-50 mix-blend-overlay"></div>
      <div className="fixed inset-0 bg-grid-white/[0.02] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-black pointer-events-none"></div>
      
      <div className="relative z-10 w-full overflow-hidden">
        <Navbar />
        
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Education />
          <Contact />
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

export default App;
