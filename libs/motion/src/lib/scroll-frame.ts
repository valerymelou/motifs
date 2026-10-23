/**
 * Calls `callback` at most once per animation frame while the page scrolls
 * or resizes, and once right away.
 *
 * @returns A function that removes the listeners.
 */
export function onScrollFrame(callback: () => void): () => void {
  let frame = requestAnimationFrame(callback);
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(callback);
  };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  return () => {
    cancelAnimationFrame(frame);
    removeEventListener('scroll', schedule);
    removeEventListener('resize', schedule);
  };
}

/** How the scrolled distance through an element maps to 0–1. */
export type ProgressRange = 'cover' | 'contain';

/**
 * Progress of an element through the viewport, from 0 to 1.
 *
 * `cover` runs from the element's top entering the bottom of the viewport to
 * its bottom leaving the top, as a CSS `view()` timeline does. `contain` runs
 * while a taller-than-viewport element fills the screen, which suits pinned
 * scroll stories.
 */
export function scrollProgress(
  top: number,
  height: number,
  viewportHeight: number,
  range: ProgressRange = 'cover',
): number {
  const [start, distance] =
    range === 'contain' && height > viewportHeight
      ? [0, height - viewportHeight]
      : [viewportHeight, viewportHeight + height];
  return clamp((start - top) / distance);
}

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}
