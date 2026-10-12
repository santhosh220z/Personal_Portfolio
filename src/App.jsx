import React, { Suspense, lazy } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Work from './components/Work';
import Architecture from './components/Architecture';
import About from './components/About';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { Education, Certifications } from './components/Credentials';
import ScrollProgress from './components/ScrollProgress';
import SmoothScroll from './components/SmoothScroll';
import { useMountOnDemand } from './lib/hooks';
import { useCommandPalette } from './lib/useCommandPalette';

/**
 * The command palette is deferred off the critical path, for the same reason the
 * blueprint drawer is (see Work.jsx): it pulls in framer-motion's AnimatePresence
 * and the full index, and most visitors never open it.
 *
 * The render guard at the call site below is what actually defers it. `lazy()`
 * fires its import when the component *renders*, not when it has something to
 * show, so rendering it unconditionally pulls the chunk during the first render
 * pass anyway. `useMountOnDemand` is the fix.
 */
const CommandPalette = lazy(() => import('./components/CommandPalette'));

const App = () => {
  const { open, openPalette, closePalette } = useCommandPalette();
  const paletteMounted = useMountOnDemand(open);

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-canvas text-fg-1">
      <SmoothScroll />
      <ScrollProgress />

      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* `openPalette` is passed down so the nav can carry a visible trigger.
          The global shortcut in useCommandPalette works with or without it —
          the button is discoverability, not the mechanism. */}
      <Nav onOpenPalette={openPalette} />

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

      {/* Sibling of <main> rather than a child of any section: the palette is a
          page-level surface, and nesting it inside a section would scope its
          stacking context to that section's geometry layer. */}
      {paletteMounted ? (
        <Suspense fallback={null}>
          <CommandPalette open={open} onClose={closePalette} />
        </Suspense>
      ) : null}
    </div>
  );
};

export default App;
