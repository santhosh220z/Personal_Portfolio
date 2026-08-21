import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Hero from './components/Hero';

import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';

import Projects from './components/Projects';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Contact from './components/Contact';

function App() {
  return (
    <div className="relative min-h-screen overflow-x-clip font-body text-ethereal-on-background">
      <div className="relative z-10 w-full overflow-hidden">
        <Navbar />

        <main className="relative">
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Education />
          <Certifications />
          <Contact />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;