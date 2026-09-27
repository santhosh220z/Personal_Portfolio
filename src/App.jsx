import React from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Work from './components/Work';
import Architecture from './components/Architecture';
import About from './components/About';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import CommandPalette from './components/CommandPalette';
import { Education, Certifications } from './components/Credentials';
import { useCommandPalette } from './lib/useCommandPalette';

const App = () => {
  const { open, openPalette, closePalette } = useCommandPalette();

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-canvas text-fg-1">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <Nav onOpenCommand={openPalette} />

      <main id="main-content" tabIndex={-1} className="relative">
        <Hero />
        <Work />
        <Architecture />
        <About />
        <Experience />
        <Education />
        <Certifications />
        <Contact />
      </main>

      <Footer />

      {/* Rendered after the footer so they paint above every section. */}
      <CustomCursor />
      <CommandPalette open={open} onClose={closePalette} />
    </div>
  );
};

export default App;
