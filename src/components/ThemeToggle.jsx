import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { applyMode, resolveMode } from '../lib/theme';

const ThemeToggle = () => {
  // resolveMode() already layers the stored preference over DEFAULT_MODE, so
  // there is nothing to reconcile on mount and no OS media query to follow.
  const [mode, setMode] = useState(resolveMode);

  const toggle = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    applyMode(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      // aria-pressed, not just the label: the label says which mode is next,
      // the pressed state says which mode is current.
      aria-pressed={mode === 'dark'}
      aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
      className="icon-btn"
    >
      {mode === 'dark' ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeToggle;
