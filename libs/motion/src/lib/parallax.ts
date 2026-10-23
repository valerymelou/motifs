import {
  afterRenderEffect,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  numberAttribute,
  signal,
  untracked,
} from '@angular/core';
import { prefersReducedMotion } from './reduced-motion';
import { onScrollFrame, scrollProgress } from './scroll-frame';

/**
 * Moves an element vertically at a fraction of the scroll speed.
 *
 * `0.2` drifts it a little, negative values move it against the scroll.
 * The page itself always scrolls at the visitor's speed.
 *
 * @example
 * <img mtParallax="0.15" … />
 */
@Directive({
  selector: '[mtParallax]',
  host: { '[style.transform]': 'transform()' },
})
export class Parallax {
  /** Share of half the viewport height the element travels each way. */
  readonly factor = input(0.2, {
    alias: 'mtParallax',
    transform: (value: unknown) => numberAttribute(value, 0.2),
  });

  private readonly reduced = prefersReducedMotion();
  private readonly offset = signal<number | null>(null);

  protected readonly transform = computed(() => {
    const offset = this.offset();
    return this.reduced() || offset === null ? null : `translateY(${offset}px)`;
  });

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

    afterRenderEffect((onCleanup) => {
      if (this.reduced()) {
        return;
      }
      const factor = this.factor();
      // Only the motion setting and the factor restart the effect; the
      // offset it writes on every frame must not.
      onCleanup(
        untracked(() =>
          typeof ViewTimeline === 'undefined'
            ? this.followScroll(element, factor)
            : animateOnViewTimeline(element, factor),
        ),
      );
    });
  }

  /** Fallback for browsers without scroll-driven animations. */
  private followScroll(element: HTMLElement, factor: number): () => void {
    const stop = onScrollFrame(() => {
      const viewportHeight = innerHeight;
      const travel = (factor * viewportHeight) / 2;
      // The measured box includes the current offset; remove it so the
      // element's own movement doesn't feed back into its progress.
      const rect = element.getBoundingClientRect();
      const top = rect.top - (this.offset() ?? 0);
      const progress = scrollProgress(top, rect.height, viewportHeight);
      this.offset.set(Math.round(-travel + 2 * travel * progress));
    });
    return () => {
      stop();
      this.offset.set(null);
    };
  }
}

/**
 * Runs the movement on the browser's own scroll timeline, off the main
 * thread. A view timeline can only be attached through the Web Animations
 * API, so this is the one place the library calls into the element.
 */
function animateOnViewTimeline(
  element: HTMLElement,
  factor: number,
): () => void {
  const travel = `${factor * 50}vh`;
  const animation = element.animate(
    [
      { transform: `translateY(calc(-1 * ${travel}))` },
      { transform: `translateY(${travel})` },
    ],
    {
      timeline: new ViewTimeline({ subject: element }),
      fill: 'both',
      easing: 'linear',
    },
  );
  return () => animation.cancel();
}
