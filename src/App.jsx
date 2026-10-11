import React from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Work from './components/Work';
import Architecture from './components/Architecture';
import About from './components/About';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { Education, Certifications } from './components/Credentials';
import { PageBackdrop } from './components/SectionGeometry';
import ScrollProgress from './components/ScrollProgress';
import SmoothScroll from './components/SmoothScroll';

const App = () => {
  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-canvas text-fg-1">
      <SmoothScroll />
      <ScrollProgress />
      <PageBackdrop />

      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <Nav />

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
    </div>
  );
};

export default App;
