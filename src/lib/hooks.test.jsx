import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import React, { useState } from 'react';
import { useMountOnDemand } from './hooks';

/**
 * `useMountOnDemand` is the newest and subtlest thing in this codebase, and it
 * exists purely to make `React.lazy` actually defer.
 *
 * The bug it prevents is easy to reintroduce and invisible in a screenshot: a
 * `lazy()` overlay rendered unconditionally still fires its dynamic import on
 * first render, because React starts the import when the component *renders* —
 * not when it decides to show something. That was measured on the built site:
 * the palette chunk was requested at ~178ms, ahead of the hero image.
 */

afterEach(cleanup);

/** Mirrors how App.jsx and Work.jsx actually consume the hook. */
const Host = ({ onRender }) => {
  const [open, setOpen] = useState(false);
  const mounted = useMountOnDemand(open);

  onRender?.(mounted, setOpen);

  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        open
      </button>
      <button type="button" onClick={() => setOpen(false)}>
        close
      </button>
      {mounted ? <div data-testid="overlay">overlay</div> : null}
    </div>
  );
};

describe('useMountOnDemand', () => {
  it('stays unmounted while closed, so the lazy chunk is never fetched', () => {
    const { getByTestId, queryByTestId } = render(<Host />);
    expect(queryByTestId('overlay')).toBeNull();
    expect(getByTestId).toBeTypeOf('function');
  });

  it('mounts on first open', () => {
    const { getByText, getByTestId } = render(<Host />);
    act(() => getByText('open').click());
    expect(getByTestId('overlay')).toBeInTheDocument();
  });

  it('stays mounted after close, so AnimatePresence can play its exit', () => {
    const { getByText, getByTestId } = render(<Host />);
    act(() => getByText('open').click());
    act(() => getByText('close').click());
    // Unmounting here is what would kill the exit animation. The component
    // itself decides when to disappear; this hook only owns "is it mounted".
    expect(getByTestId('overlay')).toBeInTheDocument();
  });

  it('is false on first render, then never returns to false', () => {
    // Asserted on the DOM rather than on every render's return value.
    // `setEverOpened` runs during render, so React discards that render and
    // re-renders immediately — an observer of the return value sees one extra
    // `false` for a render that never commits. Nothing reaches the DOM, so the
    // DOM is what actually matters here.
    const { getByTestId, queryByTestId } = render(<Host />);
    expect(queryByTestId('overlay')).toBeNull();

    act(() => screen.getByText('open').click());
    expect(getByTestId('overlay')).toBeInTheDocument();

    act(() => screen.getByText('close').click());
    expect(getByTestId('overlay')).toBeInTheDocument();

    act(() => screen.getByText('open').click());
    expect(getByTestId('overlay')).toBeInTheDocument();
  });
});

/**
 * The reduce-motion contract, quoted from src/components/kinetic/ScrubHeadline.jsx:
 * "Reduced motion drops movement, not legibility... Nothing here may leave an
 * element at opacity 0."
 *
 * This cannot be meaningfully asserted in jsdom — it has no layout engine and
 * no IntersectionObserver, so computed opacity is not the real thing. It is
 * asserted in a real browser instead; see scripts/verify-site.mjs, which checks
 * that no element is left at opacity ~0 after a full scroll under
 * `prefers-reduced-motion: reduce`. This test guards the other half of the
 * contract: that the hook driving those decisions reports the right value.
 */
describe('reduced-motion gating', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('reports reduce when the media query matches', async () => {
    const { usePrefersReducedMotion } = await import('./hooks');
    const original = window.matchMedia;
    window.matchMedia = (query) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent: () => false,
    });

    const Probe = () => {
      const reduce = usePrefersReducedMotion();
      return <span data-testid="v">{String(reduce)}</span>;
    };

    render(<Probe />);
    expect(screen.getByTestId('v')).toHaveTextContent('true');
    window.matchMedia = original;
  });
});