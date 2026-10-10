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
import { PageBackdrop } from './components/SectionGeometry';
import { useCommandPalette } from './lib/useCommandPalette';
import { useMountOnDemand } from './lib/hooks';

/**
 * The command palette is deferred off the critical path.
 *
 * It is the only thing in the tree that pulls in the fuzzy-search plumbing, and
 * most visitors never open it.
 *
 * NOTE ON THE RENDER GUARD BELOW — this is the part that is easy to get wrong.
 * `lazy()` fires its dynamic import when the component is *rendered*, not when
 * it decides to display something. Rendering <CommandPalette open={false}/>
 * unconditionally therefore pulls the chunk during the first render pass
 * anyway, at full priority, competing with the hero image and the fonts.
 * Measured on the built site: the chunk was requested at ~178ms, before the
 * portrait at ~184ms. So the component is only rendered once `open` is true,
 * which is what actually defers it.
 *
 * The consequence is that the first Cmd/Ctrl+K pays for the fetch. On a warm
 * cache that is a few milliseconds; on a cold one it is a visible beat. That is
 * the deliberate trade — a one-off delay on a shortcut, in exchange for ~11 KB
 * that most visitors never need.
 *
 * The Suspense fallback is empty on purpose: there is no visible surface to hold
 * a spinner, and the palette's own open animation already covers the wait.
 */
const CommandPalette = lazy(() => import('./components/CommandPalette'));

const App = () => {
  const { open, openPalette, closePalette } = useCommandPalette();
  const paletteMounted = useMountOnDemand(open);

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-canvas text-fg-1">
      <PageBackdrop />

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

      {paletteMounted ? (
        <Suspense fallback={null}>
          <CommandPalette open={open} onClose={closePalette} />
        </Suspense>
      ) : null}
    </div>
  );
};

export default App;
