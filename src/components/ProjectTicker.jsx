import { useCallback } from 'react';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/hooks';

/** px the stroke title travels right on hover. */
const SLIDE = 16;

/** Resting stroke opacity, mirrored by the `--stroke-alpha` writes below. */
const STROKE_REST = 0.4;

/**
 * The featured-work list.
 *
 * Rest state: index, outlined title, right-aligned stack. Hover: the title
 * fills solid and slides right. Click: the blueprint drawer opens — owned by
 * the parent, so the drawer and this list share one source of truth for which
 * project is open.
 *
 * There is deliberately no per-row preview image. An earlier revision tracked
 * the cursor with a floating capsule, which meant the row's only real content
 * was hidden until you pointed at it, and it was unavailable on touch entirely.
 * The blueprint drawer is where the detail lives now, and the row is a plain
 * link to it.
 */
const ProjectTicker = ({ projects, onOpen }) => {
  const reduceMotion = usePrefersReducedMotion();

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

  const onEnter = (row) => () => fillRow(row);

  const onLeave = (row) => () => clearRow(row);

  return (
    <div className="border-t border-rule">
      {projects.map((project) => (
        <div key={project.id} className="border-b border-rule">
          <a
            href={`#work-${project.id}`}
            aria-label={`${project.title} — open the technical blueprint`}
            onClick={(event) => {
              event.preventDefault();
              onOpen(project);
            }}
            onPointerEnter={(event) => onEnter(event.currentTarget)()}
            onPointerLeave={(event) => onLeave(event.currentTarget)()}
            // Keyboard parity: focusing a row must produce the same feedback
            // as hovering it, or the fill-and-slide is mouse-only.
            onFocus={(event) => onEnter(event.currentTarget)()}
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
  );
};

export default ProjectTicker;