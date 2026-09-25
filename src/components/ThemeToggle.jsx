import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { applyMode, resolveMode } from '../lib/theme';

const ThemeToggle = () => {
  const [mode, setMode] = useState(resolveMode);

  useEffect(() => {
    // Keep following the OS until the visitor states a preference.
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => {
      if (window.localStorage.getItem('theme')) return;
      const next = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      setMode(next);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    applyMode(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
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
