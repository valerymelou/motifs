import {
  afterRenderEffect,
  Directive,
  ElementRef,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { prefersReducedMotion } from './reduced-motion';
import {
  onScrollFrame,
  scrollProgress,
  type ProgressRange,
} from './scroll-frame';

/**
 * Tracks how far a section has scrolled through the viewport, from 0 to 1.
 *
 * The value is exposed as the `--mt-scroll-progress` custom property on the
 * element, for CSS, and as the `progress` signal, for templates:
 *
 * @example
 * <section mtScrollProgress="contain" #story="mtScrollProgress">
 *   Stage {{ story.progress() > 0.5 ? 'two' : 'one' }}
 * </section>
 */
@Directive({
  selector: '[mtScrollProgress]',
  exportAs: 'mtScrollProgress',
  host: { '[style.--mt-scroll-progress]': 'progress()' },
})
export class ScrollProgress {
  /** `cover` (default) or `contain`; see `scrollProgress`. */
  readonly range = input<ProgressRange, ProgressRange | ''>('cover', {
    alias: 'mtScrollProgress',
    transform: (value) => value || 'cover',
  });

  private readonly reduced = prefersReducedMotion();
  private readonly value = signal(0);

  /** Progress from 0 to 1. Stays at 0 when reduced motion is on. */
  readonly progress = this.value.asReadonly();

  constructor() {
    const element = inject<ElementRef<Element>>(ElementRef).nativeElement;

    afterRenderEffect((onCleanup) => {
      if (this.reduced()) {
        this.value.set(0);
        return;
      }
      const range = this.range();
      onCleanup(
        untracked(() =>
          onScrollFrame(() => {
            const rect = element.getBoundingClientRect();
            this.value.set(
              scrollProgress(rect.top, rect.height, innerHeight, range),
            );
          }),
        ),
      );
    });
  }
}
