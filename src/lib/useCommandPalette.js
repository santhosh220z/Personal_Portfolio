import { useCallback, useEffect, useState } from 'react';

/**
 * Global command-palette shortcut wiring.
 *
 * Kept in its own module rather than exported alongside the palette component:
 * a file that exports both a component and a hook breaks React Fast Refresh,
 * which silently falls back to a full reload on every save.
 */
const isTypingTarget = (target) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

export const useCommandPalette = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event) => {
      const { key, metaKey, ctrlKey, altKey } = event;
      const isPaletteKey = (metaKey || ctrlKey) && key.toLowerCase() === 'k';

      // "/" is a shortcut, but only when you are not already typing. Typing a
      // slash into a text field must never summon an overlay on top of it.
      const isSlash = key === '/' && !metaKey && !ctrlKey && !altKey && !isTypingTarget(event.target);

      if (!isPaletteKey && !isSlash) return;

      event.preventDefault();
      setOpen((current) => !current);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Stable identities, so <Nav> and <CommandPalette> are not re-rendered by a
  // new closure on every App render.
  const openPalette = useCallback(() => setOpen(true), []);
  const closePalette = useCallback(() => setOpen(false), []);

  return { open, openPalette, closePalette };
};
