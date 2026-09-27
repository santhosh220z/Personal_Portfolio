import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CornerDownLeft, Search } from 'lucide-react';
import { useDialogBehaviour, usePrefersReducedMotion } from '../lib/hooks';
import { COMMAND_INDEX } from '../data/site';

/** Subsequence match, so "arch" finds "Architecture" and "lnk" finds "LinkedIn". */
const fuzzyScore = (haystack, needle) => {
  if (!needle) return { score: 0, hits: [] };
  const text = haystack.toLowerCase();
  const query = needle.toLowerCase();

  const direct = text.indexOf(query);
  if (direct !== -1) {
    return {
      // Prefix matches outrank mid-word matches, which outrank subsequences.
      score: 1000 - direct * 2 - (direct === 0 ? 200 : 0),
      hits: Array.from({ length: query.length }, (_, i) => direct + i),
    };
  }

  const hits = [];
  let cursor = 0;
  for (const char of query) {
    const found = text.indexOf(char, cursor);
    if (found === -1) return null;
    hits.push(found);
    cursor = found + 1;
  }
  return { score: 100 - text.length * 0.1 - hits[hits.length - 1], hits };
};

const highlight = (text, hits) => {
  if (!hits?.length) return text;
  const set = new Set(hits);
  return Array.from(text, (char, index) => (set.has(index) ? `\u0001${char}` : char))
    .join('')
    .split('\u0001')
    .map((part, index) => (index % 2 === 1 ? <mark key={index}>{part}</mark> : part));
};

const CommandPalette = ({ open, onClose }) => {
  const panelRef = useRef(null);
  const listRef = useRef(null);
  const reduceMotion = usePrefersReducedMotion();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const scored = COMMAND_INDEX.map((item) => {
      const match = fuzzyScore(item.label, query);
      return match ? { item, ...match } : null;
    }).filter(Boolean);

    scored.sort((a, b) => b.score - a.score);
    return scored;
  }, [query]);

  // Reset on open so the palette never comes back to a stale filter.
  //
  // Done as React's documented "adjust state during render" pattern rather
  // than in an effect: the reset depends on the previous value of `open`, not
  // on any external system, and an effect here would paint one frame of the
  // previous session's results before correcting.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setQuery('');
      setActiveIndex(0);
    }
  }

  useDialogBehaviour(open, panelRef, onClose);

  // Keep the highlighted row in view while arrowing through a long list.
  useEffect(() => {
    const node = listRef.current?.children[activeIndex];
    node?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const go = useCallback(
    (entry) => {
      const { item } = entry;
      onClose();

      if (item.download) {
        const anchor = document.createElement('a');
        anchor.href = item.href;
        anchor.download = '';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        return;
      }

      if (item.external) {
        window.open(item.href, '_blank', 'noopener,noreferrer');
        return;
      }

      // Respect the reduced-motion preference on the jump too: native smooth
      // scrolling is a long, disorienting move when motion is unwelcome.
      const target = document.querySelector(item.href);
      target?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      // Move focus so keyboard and screen-reader users land in the new section
      // instead of staying on the bar behind the palette.
      window.setTimeout(() => {
        target?.setAttribute('tabindex', '-1');
        target?.focus({ preventScroll: true });
      }, reduceMotion ? 0 : 620);
    },
    [onClose, reduceMotion],
  );

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown' || (event.key === 'n' && event.ctrlKey)) {
      event.preventDefault();
      setActiveIndex((index) => (results.length ? (index + 1) % results.length : 0));
      return;
    }
    if (event.key === 'ArrowUp' || (event.key === 'p' && event.ctrlKey)) {
      event.preventDefault();
      setActiveIndex((index) =>
        results.length ? (index - 1 + results.length) % results.length : 0,
      );
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const entry = results[activeIndex];
      if (entry) go(entry);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[130] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.18 }}
        >
          <button
            type="button"
            aria-label="Close command palette"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-canvas-deep/70 backdrop-blur-sm"
            tabIndex={-1}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="panel-blur relative w-full max-w-xl overflow-hidden rounded-xl shadow-2xl"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 0.61, 0.36, 1] }}
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-rule px-4">
              <Search size={16} className="shrink-0 text-fg-3" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                placeholder="Jump to a section or a link…"
                aria-label="Search commands"
                aria-controls="command-results"
                aria-activedescendant={
                  results[activeIndex]
                    ? `command-${results[activeIndex].item.label.replace(/\W+/g, '-')}`
                    : undefined
                }
                autoComplete="off"
                spellCheck="false"
                className="h-14 w-full bg-transparent font-mono text-sm text-fg-1 outline-none placeholder:text-fg-3"
              />
              <kbd className="meta shrink-0 rounded-xs border border-rule px-1.5 py-1">ESC</kbd>
            </div>

            <ul
              id="command-results"
              ref={listRef}
              role="listbox"
              aria-label="Commands"
              className="max-h-[46vh] list-none overflow-y-auto p-2"
            >
              {results.length === 0 ? (
                <li className="px-3 py-8 text-center">
                  <span className="meta">No match for “{query}”</span>
                </li>
              ) : (
                results.map((entry, index) => {
                  const { item, hits } = entry;
                  return (
                    <li key={`${item.group}-${item.label}`} role="none">
                      <button
                        type="button"
                        id={`command-${item.label.replace(/\W+/g, '-')}`}
                        role="option"
                        aria-selected={index === activeIndex}
                        onClick={() => go(entry)}
                        onPointerMove={() => setActiveIndex(index)}
                        className={`flex w-full items-center justify-between gap-4 rounded-sm px-3 py-2.5 text-left transition-colors ${
                          index === activeIndex
                            ? 'bg-accent-soft text-fg-1'
                            : 'text-fg-2 hover:bg-surface-sunken'
                        }`}
                      >
                        <span className="flex items-baseline gap-3">
                          <span className="meta w-20 shrink-0">{item.group}</span>
                          <span className="text-[length:var(--text-body)]">
                            {highlight(item.label, hits)}
                          </span>
                        </span>
                        {index === activeIndex ? (
                          <CornerDownLeft size={14} className="shrink-0 text-accent" aria-hidden="true" />
                        ) : null}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>

            <div className="flex items-center justify-between gap-4 border-t border-rule px-4 py-2.5">
              <span className="meta">↑↓ Navigate</span>
              <span className="meta">↵ Open</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};


export default CommandPalette;