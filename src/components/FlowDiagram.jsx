import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';

/**
 * Vector system-flow diagram.
 *
 * Stages run left to right on wide viewports and stack vertically on narrow
 * ones. Built as real DOM with a CSS-drawn connector rather than one big SVG,
 * because the flow has to stay selectable, translatable, and legible to a
 * screen reader — an `<img>` of a diagram fails all three.
 *
 * Each connector is a pseudo-element on the stage, so no extra nodes are
 * needed and the arrow reorients with the layout direction.
 */
const FlowDiagram = ({ flow }) => {
  const rootRef = useRef(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) return undefined;

    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-flow-stage]',
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          duration: 0.45,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: root, start: 'top 85%', once: true },
        },
      );

      gsap.fromTo(
        '[data-flow-link]',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.4,
          ease: 'power2.out',
          stagger: 0.08,
          transformOrigin: 'left center',
          scrollTrigger: { trigger: root, start: 'top 85%', once: true },
        },
      );
    }, root);

    return () => context.revert();
  }, [reduceMotion]);

  return (
    <div
      ref={rootRef}
      className="flow-diagram flex flex-col gap-0 md:flex-row md:items-stretch"
      role="img"
      aria-label={`System flow: ${flow.map((stage) => stage.stage).join(' to ')}`}
    >
      {flow.map((stage, index) => (
        <React.Fragment key={stage.stage}>
          <div data-flow-stage className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="meta meta-accent">{String(index + 1).padStart(2, '0')}</span>
              <span className="meta meta-strong">{stage.stage}</span>
            </div>

            <ul className="mt-3 flex list-none flex-col gap-1.5 p-0">
              {stage.nodes.map((node) => (
                <li
                  key={node}
                  className="rounded-xs border border-rule bg-surface-sunken px-2.5 py-1.5 font-mono text-[11px] leading-tight tracking-[0.04em] text-fg-2"
                >
                  {node}
                </li>
              ))}
            </ul>
          </div>

          {index < flow.length - 1 ? (
            <div
              data-flow-link
              aria-hidden="true"
              className="relative my-2 h-6 w-full shrink-0 md:my-0 md:h-auto md:w-8"
            >
              {/* Horizontal on desktop, vertical on mobile. Both are the same
                  element with a rotated gradient rather than two separate
                  nodes, so there is no duplicated markup to keep in sync. */}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="block h-px w-full bg-gradient-to-r from-accent-line via-accent to-accent-line md:w-px md:bg-gradient-to-b" />
                <span className="absolute end-0 bottom-0 h-1.5 w-1.5 border-r border-b border-accent md:end-auto md:top-0 md:border-t md:border-r md:border-b-0" />
              </span>
            </div>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
};

export default FlowDiagram;
