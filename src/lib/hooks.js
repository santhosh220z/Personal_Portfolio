import { useCallback, useEffect, useLayoutEffect, useState, useSyncExternalStore } from 'react';

/**
 * useLayoutEffect that stays quiet on the server. This is a Vite SPA so there
 * is no server render today, but every measure-then-paint component in this
 * project (marquee width, capsule offset, drawer height) depends on this
 * primitive and a future SSR migration should not turn them into warnings.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Subscribes to a `matchMedia` query and returns a settled boolean.
 *
 * Built on useSyncExternalStore rather than the usual
 * `useState(mq.matches)` + `useEffect(setState)` pair. The state+effect version
 * has to write setState inside the effect body to stay in sync with the query,
 * which React flags as a cascading render and which genuinely does cost an
 * extra pass. useSyncExternalStore is designed for exactly this shape of
 * external source: the store is the media query, and the snapshot is a boolean
 * with no null "not yet known" phase to guard against.
 */
function useMatchMedia(query) {
  const subscribe = useCallback(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/**
 * Boolean, never null.
 *
 * Gating on this decides whether a GSAP tween starts, whether the custom cursor
 * mounts, and whether a scroll parallax runs. A hook that returns null on the
 * first render would make every one of those branches render the motion path
 * once and then correct, which is visible as a flicker.
 */
export const usePrefersReducedMotion = () =>
  useMatchMedia('(prefers-reduced-motion: reduce)');

/** Live media query as a settled boolean. */
export const useMediaQuery = (query) => useMatchMedia(query);

/** True only for a real mouse/trackpad. Gates the custom cursor and every
 *  pointer-tracking tilt, because on touch the values only ever get one junk
 *  sample at tap time and then never update. */
export const useFinePointer = () => useMatchMedia('(hover: hover) and (pointer: fine)');

/**
 * Freezes the page behind a modal surface.
 *
 * Compensating for the scrollbar width keeps the page from jumping sideways
 * the moment the bar disappears — on Windows that is a ~15px reflow of every
 * centred element in the document.
 */
export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return undefined;

    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [locked]);
}

/**
 * Ticking wall clock in a fixed IANA zone.
 *
 * Runs on a 1000ms interval aligned to the next whole second rather than
 * "1000ms after mount", otherwise the seconds digit visibly stutters against
 * a real clock for the first tick.
 */
export function useLocalTime(timeZone = 'Asia/Kolkata') {
  const format = useCallback(
    (date) =>
      new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(date),
    [timeZone],
  );

  const [time, setTime] = useState(() =>
    typeof window === 'undefined' ? '--:--:--' : format(new Date()),
  );

  useEffect(() => {
    let timeoutId = 0;
    let intervalId = 0;

    const tick = () => {
      const now = new Date();
      setTime(format(now));
      // Re-align to the next second boundary so the digit does not drift.
      const delay = 1000 - (now.getTime() % 1000);
      timeoutId = window.setTimeout(() => {
        intervalId = window.setInterval(tick, 1000);
      }, delay);
    };

    tick();
    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [format]);

  return time;
}

/**
 * Runs `handler` on Escape and traps Tab inside `containerRef` while `active`.
 *
 * A focus trap is the difference between a command palette that is genuinely
 * keyboard-operable and one that quietly drops focus back to the page behind
 * it, which strands screen-reader users mid-page.
 */
export function useDialogBehaviour(active, containerRef, onClose) {
  useEffect(() => {
    if (!active) return undefined;

    const previouslyFocused = document.activeElement;
    const container = containerRef.current;

    const focusables = () =>
      Array.from(
        container?.querySelectorAll(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

    // Defer so the element exists and its enter transition has begun.
    const raf = requestAnimationFrame(() => focusables()[0]?.focus());

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown, true);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [active, containerRef, onClose]);
}
