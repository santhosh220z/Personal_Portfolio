import React, { useCallback, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { revealViewport } from '../../lib/motion';
import { useFinePointer } from '../../lib/hooks';

/**
 * A section title whose words drift toward the pointer.
 *
 * Hover is a *tens-of-times-a-day* interaction, so per the animation decision
 * framework this is deliberately, drastically reduced: peak travel under 2px, no
 * spring overshoot, no follow-through. Anything larger stops reading as feedback
 * and starts reading as a gimmick the reader has to wait out.
 *
 * The offset is written straight to `style.transform` from the pointer handler
 * rather than through a MotionValue per word. A per-word `useTransform` would
 * mean a variable number of hook calls, which breaks the rules of hooks; and
 * routing it through React state would re-render the whole section on every
 * sample. Writing transform directly is the hardware-accelerated path and
 * touches exactly one element.
 *
 * Smoothing is a CSS transition, not a spring. A transition retargets from the
 * current computed value, so a fast pointer sweep stays continuous instead of
 * restarting from zero — which is the interruptibility requirement.
 *
 * Deliberately no `will-change: transform` here. It would promote every word of
 * every section heading to its own compositing layer — roughly forty on this
 * page — to animate a 1.5px nudge nobody can see frame-to-frame. Promoting a
 * layer costs memory, and at this amplitude the browser keeps the transform on
 * the compositor anyway. Reserve it for motion big enough to drop frames.
 *
 * Split per word, not per glyph. At `--text-display` (up to 6rem) a per-glyph
 * split is ~25 spans per heading, and it breaks text selection and makes screen
 * readers spell words out. Per word keeps the heading selectable and naturally
 * pronounceable, and at this amplitude reads the same.
 *
 * Purpose: *feedback* — confirms the title is a live surface. Gated on a fine
 * pointer because on touch the pointer only ever produces one junk sample at tap
 * time, which would leave the title parked off-centre. Disabled outright under
 * reduced motion, where the opacity reveal above it still carries the entrance.
 */

/** Peak travel at the edge of the heading, in px. Kept under 2 by design. */
const MAX_SHIFT = 1.5;

/**
 * How hard a word is pulled. 0 = directly under the pointer, 0 at the far edge.
 * Squared so the influence stays tight to the cursor and does not drag the whole
 * line bodily across the section.
 *
 * The clamp matters: `|pointer - centre| * 2` overshoots 1 at the outer words
 * (a 4-word heading puts the last centre at 0.875, so the raw distance reaches
 * 1.75). Without clamping, `1 - distance` goes negative, the square flips it
 * positive again, and the outer words never return to neutral — the whole
 * heading sits permanently offset instead of tracking the pointer.
 */
const pull = (wordCentre, pointer) => {
  const distance = Math.abs(pointer - wordCentre) * 2; // 0 at pointer, 1 at edge
  return Math.max(0, 1 - distance) ** 2;
};

const ReactiveTitle = ({ id, className = '', children }) => {
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();

  const react = finePointer && !reduceMotion;

  const handlePointerMove = useCallback(
    (event) => {
      if (!react) return;

      const box = containerRef.current?.getBoundingClientRect();
      if (!box || box.width === 0) return;

      const pointer = (event.clientX - box.left) / box.width;
      const count = wordRefs.current.length;
      if (count === 0) return;

      wordRefs.current.forEach((word, index) => {
        if (!word) return;
        const centre = (index + 0.5) / count;
        const direction = pointer > centre ? 1 : -1;
        const offset = direction * MAX_SHIFT * pull(centre, pointer);
        word.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`;
      });
    },
    [react],
  );

  const handlePointerLeave = useCallback(() => {
    wordRefs.current.forEach((word) => {
      if (word) word.style.transform = '';
    });
  }, []);

  const words = React.Children.toArray(children).flatMap((child) =>
    typeof child === 'string' ? child.split(/\s+/).filter(Boolean) : [child],
  );

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: reduceMotion ? 0 : 0.5, ease: [0.22, 0.61, 0.36, 1] },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      <h2
        id={id}
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`text-[length:var(--text-display)] ${className}`}
      >
        {words.map((word, index) => (
          <React.Fragment key={`${index}-${typeof word === 'string' ? word : 'node'}`}>
            <span
              ref={(node) => {
                wordRefs.current[index] = node;
              }}
              className={`inline-block ${
                react
                  ? 'transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]'
                  : ''
              }`}
            >
              {word}
            </span>
            {index < words.length - 1 ? ' ' : null}
          </React.Fragment>
        ))}
      </h2>
    </motion.div>
  );
};

export default ReactiveTitle;
