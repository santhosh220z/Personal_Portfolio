import React, { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';

/** px the stroke title travels right on hover. */
const SLIDE = 16;

/** Resting stroke opacity, mirrored by the `--stroke-alpha` writes below. */
const STROKE_REST = 0.4;

/** Capsule geometry. Fixed, not fluid: the preview should read as a physical
 *  object travelling with the cursor, not as a tooltip that resizes. */
const CAPSULE = { w: 320, h: 208, gap: 28, edge: 16 };

/**
 * Where the capsule sits for a given pointer position.
 *
 * Shared by the tracking path and the reduced-motion path, which is the whole
 * point of extracting it: the reduced-motion branch used to place the capsule
 * with a bare `clientY - h/2` and no clamp, so hovering the bottom of a row
 * pushed a third of it off the bottom of the screen. Keeping the arithmetic in
 * one place means the two paths cannot disagree about where "inside the
 * viewport" is.
 */
const place = (clientX, clientY, height) => {
  // Prefer the right of the pointer; flip left when that would overflow.
  const roomRight = window.innerWidth - clientX - CAPSULE.gap - CAPSULE.edge;
  const flip = roomRight < CAPSULE.w;
  const x = flip ? clientX - CAPSULE.gap - CAPSULE.w : clientX + CAPSULE.gap;

  // Vertically centre on the pointer, then clamp inside the viewport.
  const rawY = clientY - height / 2;
  const y = Math.min(
    Math.max(rawY, CAPSULE.edge),
    Math.max(CAPSULE.edge, window.innerHeight - height - CAPSULE.edge),
  );

  return { x, y };
};

/**
 * Cursor-following preview capsule.
 *
 * Owns its own entrance, tracking, and exit, because all three are keyed off
 * "is there a project right now" — splitting that state across a parent and a
 * child is how you end up with a capsule stuck visible after the pointer has
 * already left the list.
 *
 * Position comes entirely from `gsap.quickTo`: one cached tween per axis,
 * retargeted on every pointermove. A `gsap.to()` per event would allocate a
 * fresh tween roughly 120 times a second, and because each starts from the
 * current value the capsule would visibly trail the pointer by a frame per
 * allocation. quickTo retargets one tween instead, so the settle completes
 * inside a single frame — which is what "zero cursor lag" actually requires.
 *
 * The capsule is offset from the pointer rather than centred on it: a capsule
 * sitting under the cursor hides the thing it is previewing and makes the row
 * underneath feel unclickable.
 */
const PreviewCapsule = ({ project }) => {
  const capsuleRef = useRef(null);
  const videoRef = useRef(null);
  const reduceMotion = usePrefersReducedMotion();

  const shownId = project?.id ?? null;
  const lastPointer = useRef({ clientX: 0, clientY: 0 });
  const previousId = useRef(null);

  // One broken demo must not disable video for every later project, so the
  // failure flag is scoped to the project that produced it. Resetting on a
  // project change is a render-time adjustment rather than an effect: it
  // depends only on the previous value of `shownId`, and an effect would leave
  // the previous project's failure state visible for a frame.
  const [videoOkFor, setVideoOkFor] = useState(shownId);
  const [videoOk, setVideoOk] = useState(true);

  if (videoOkFor !== shownId) {
    setVideoOkFor(shownId);
    setVideoOk(true);
  }

  // Track the pointer continuously so the first frame of a *new* project can be
  // placed under the cursor instead of animating in from the last one.
  useEffect(() => {
    const onMove = (event) => {
      lastPointer.current = { clientX: event.clientX, clientY: event.clientY };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  // quickTo setup, created once and shared with the entrance effect.
  const moveRef = useRef(null);

  useEffect(() => {
    const capsule = capsuleRef.current;
    if (!capsule) return undefined;

    if (reduceMotion) {
      moveRef.current = null;
      // xPercent does the centring. An earlier revision centred with the CSS
      // `translate: -50%` property instead, which GSAP reads and folds into its
      // own transform the first time it touches the element — after which the
      // two stop being independent and the offset has to be guessed at. Letting
      // GSAP own the whole transform makes the maths exact: visual left edge is
      // always `x - w/2`.
      gsap.set(capsule, { xPercent: -50 });
      return undefined;
    }

    const xTo = gsap.quickTo(capsule, 'x', { duration: 0.18, ease: 'power3' });
    const yTo = gsap.quickTo(capsule, 'y', { duration: 0.18, ease: 'power3' });
    // Rotation gets a quickTo for the same reason x and y do: a gsap.set per
    // pointermove would allocate a fresh zero-duration tween ~120 times a
    // second for a value that only ever moves a degree or two.
    //
    // `rotation`, not `rotate`: `rotate` is a compound alias and quickTo warns
    // "rotate not eligible for reset" for it, because it cannot cache a start
    // value to reset against. The individual property can.
    const rotateTo = gsap.quickTo(capsule, 'rotation', { duration: 0.4, ease: 'power3' });
    gsap.set(capsule, { xPercent: -50 });

    moveRef.current = (clientX, clientY) => {
      const { x, y } = place(clientX, clientY, capsule.offsetHeight || CAPSULE.h);
      xTo(x);
      yTo(y);

      // A small roll tied to horizontal travel reads as the card having mass,
      // rather than as a 2D sprite sliding on rails.
      const skew = (x + CAPSULE.w / 2 - window.innerWidth / 2) / (window.innerWidth / 2);
      rotateTo(Math.max(-3, Math.min(3, skew * 3)));
    };

    const onMove = (event) => moveRef.current?.(event.clientX, event.clientY);
    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      moveRef.current = null;
      window.removeEventListener('pointermove', onMove);
      gsap.killTweensOf(capsule);
    };
  }, [reduceMotion]);

  // Entrance and exit. Presence of a project is the single source of truth.
  useEffect(() => {
    const capsule = capsuleRef.current;
    if (!capsule) return;

    if (!shownId) {
      previousId.current = null;
      // No `overwrite` here on purpose. `overwrite: 'auto'` kills every tween
      // on the same target, including the quickTo tweens that drive x and y —
      // and a killed quickTo leaves quickTo holding a dead tween, so the
      // capsule silently stops tracking the pointer for the rest of the
      // session. These tweens only touch opacity and visibility, which nothing
      // else animates, so there is nothing to overwrite.
      gsap.to(capsule, { autoAlpha: 0, duration: 0.18, ease: 'power2.out' });
      return;
    }

    const isNewProject = previousId.current !== shownId;
    previousId.current = shownId;

    if (reduceMotion) {
      // The preview still has to be readable with motion unwelcome, so it
      // appears beside the pointer and stays there. Clamped with the same
      // arithmetic as the tracking path so it can never be placed off-screen.
      const { clientX, clientY } = lastPointer.current;
      const { x, y } = place(clientX, clientY, capsuleRef.current.offsetHeight || CAPSULE.h);
      gsap.set(capsule, { x, y });
      gsap.set(capsule, { autoAlpha: 1 });
      return;
    }

    if (isNewProject) {
      const { clientX, clientY } = lastPointer.current;
      moveRef.current?.(clientX, clientY);
    }

    gsap.to(capsule, {
      autoAlpha: 1,
      duration: isNewProject ? 0.2 : 0,
      ease: 'power2.out',
    });
  }, [shownId, reduceMotion]);

  // Restart the demo clip when the project changes, and never leave a loop
  // playing behind a hidden capsule.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shownId) {
      const attempt = video.play();
      // Autoplay can still be refused (low power mode, reduced data). A
      // rejected promise is not an error worth surfacing — the poster is up.
      if (attempt?.catch) attempt.catch(() => {});
    } else {
      video.pause();
    }
  }, [shownId, videoOk]);

  return (
    <div
      ref={capsuleRef}
      aria-hidden="true"
      data-preview-capsule="true"
      // will-change: the quickTo tweens rewrite `transform` on every pointer
      // move, so the layer has to be promoted ahead of time or the first move
      // of every hover pays for it. The capsule is visibility:hidden while
      // idle, so the idle cost is a layer that is not being painted anyway.
      className="pointer-events-none fixed left-0 top-0 z-[110] will-change-transform overflow-hidden rounded-xl border border-white/20 shadow-2xl"
      style={{
        width: CAPSULE.w,
        height: CAPSULE.h,
        visibility: 'hidden',
        opacity: 0,
      }}
    >
      {project ? (
        project.demo && videoOk ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={project.demo}
            poster={project.image}
            muted
            loop
            playsInline
            preload="none"
            onError={() => setVideoOk(false)}
          />
        ) : (
          <img
            src={project.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover grayscale contrast-110"
          />
        )
      ) : null}

      {/* Wash and caption bar, so the capsule reads as part of this palette
          rather than as an arbitrary screenshot pasted over the page. */}
      <div aria-hidden="true" className="absolute inset-0 bg-accent opacity-[0.1] mix-blend-overlay" />
      {project ? (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-canvas-deep/90 to-transparent px-3 pt-10 pb-2.5"
        >
          <span className="meta meta-accent">{project.index}</span>
          <span className="meta meta-strong">{project.kicker}</span>
        </div>
      ) : null}
    </div>
  );
};

/**
 * The featured-work list.
 *
 * Rest state: index, outlined title, right-aligned stack. Hover: the title
 * fills solid and slides right; the capsule follows the pointer. Click: the
 * blueprint drawer opens — owned by the parent, so the drawer and this list
 * share one source of truth for which project is open.
 */
const ProjectTicker = ({ projects, onOpen }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const reduceMotion = usePrefersReducedMotion();

  const active = projects.find((project) => project.id === hoveredId) ?? null;

  const fillRow = useCallback(
    (row) => {
      const title = row?.querySelector('[data-row-title]');
      if (!title) return;

      title.setAttribute('data-fill', 'true');

      if (reduceMotion) {
        gsap.set(title, { x: SLIDE, '--stroke-alpha': 1 });
        return;
      }

      gsap.to(title, {
        x: SLIDE,
        '--stroke-alpha': 1,
        duration: 0.55,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    },
    [reduceMotion],
  );

  const clearRow = useCallback((row) => {
    const title = row?.querySelector('[data-row-title]');
    if (!title) return;

    title.setAttribute('data-fill', 'false');
    gsap.to(title, {
      x: 0,
      '--stroke-alpha': STROKE_REST,
      duration: 0.4,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  }, []);

  const onEnter = (row, id) => () => {
    setHoveredId(id);
    fillRow(row);
  };

  const onLeave = (row) => () => {
    setHoveredId(null);
    clearRow(row);
  };

  return (
    <>
      <div className="border-t border-rule">
        {projects.map((project) => (
          <div key={project.id} className="border-b border-rule">
            <a
              href={`#work-${project.id}`}
              data-cursor="magnet"
              aria-label={`${project.title} — open the technical blueprint`}
              onClick={(event) => {
                event.preventDefault();
                onOpen(project);
              }}
              onPointerEnter={(event) => onEnter(event.currentTarget, project.id)()}
              onPointerLeave={(event) => onLeave(event.currentTarget)()}
              // Keyboard parity: focusing a row must produce the same feedback
              // as hovering it, or the fill-and-slide is mouse-only.
              onFocus={(event) => onEnter(event.currentTarget, project.id)()}
              onBlur={(event) => onLeave(event.currentTarget)()}
              className="group block px-1 py-7 outline-offset-4 transition-colors md:px-4 md:py-9"
            >
              {/* items-start, not items-center: the index and the stack are
                  single-line labels beside a title that is frequently two lines
                  tall. Centring them against the block makes both look
                  mis-registered on exactly the rows that wrap. */}
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
                <span className="meta shrink-0 pt-2 md:basis-16 lg:basis-20">
                  {project.index}
                  <span className="text-fg-3"> / </span>
                </span>

                <span
                  data-row-title
                  data-fill="false"
                  className="stroke-type block flex-1 text-[clamp(1.75rem,4.6vw,3.5rem)] font-extrabold uppercase leading-[0.9] will-change-transform"
                >
                  {project.title}
                </span>

                {/* Visible at rest. The brief's rest state is index + outlined
                    title + right-aligned stack, and an earlier revision faded
                    these in on hover — which quietly deleted a third of the
                    row's content until you pointed at it. */}
                <span
                  data-row-caption
                  aria-hidden="true"
                  className="flex shrink-0 flex-wrap gap-x-3 gap-y-1 pt-2.5 transition-colors duration-300 group-hover:text-fg-1 md:max-w-[20rem] md:justify-end"
                >
                  {project.stack.map((tech) => (
                    <span key={tech} className="meta">
                      {tech}
                    </span>
                  ))}
                </span>
              </div>

              <span className="mt-4 block max-w-[62ch] text-sm leading-relaxed text-fg-2 transition-colors group-hover:text-fg-1 md:mt-5">
                {project.summary}
              </span>
            </a>
          </div>
        ))}
      </div>

      <PreviewCapsule project={active} />
    </>
  );
};

export default ProjectTicker;
