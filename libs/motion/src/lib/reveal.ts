import {
  afterNextRender,
  computed,
  contentChildren,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { prefersReducedMotion } from './reduced-motion';

type RevealState = 'static' | 'hidden' | 'shown';

/**
 * Fades and lifts an element in the first time it scrolls into view.
 *
 * Elements already on screen at load stay as they are, so nothing visible
 * blinks out and back in. Duration, easing and distance come from the
 * `--mt-reveal-duration`, `--mt-reveal-easing` and `--mt-reveal-distance`
 * custom properties, so each page's theme sets its own feel.
 */
@Directive({
  selector: '[mtReveal]',
  host: {
    '[style.opacity]': 'hidden() ? 0 : null',
    '[style.transform]':
      "hidden() ? 'translateY(var(--mt-reveal-distance, 1.5rem))' : null",
    '[style.transition]': 'transition()',
  },
})
export class Reveal {
  /** Extra delay before the reveal, in milliseconds. */
  readonly delay = input(0, {
    alias: 'mtRevealDelay',
    transform: (value: unknown) => numberAttribute(value, 0),
  });

  private readonly stagger = inject(Stagger, { optional: true });
  private readonly reduced = prefersReducedMotion();
  private readonly state = signal<RevealState>('static');

  protected readonly hidden = computed(
    () => !this.reduced() && this.state() === 'hidden',
  );

  protected readonly transition = computed(() => {
    // Hiding is instant (the element is off screen); only the reveal animates.
    if (this.reduced() || this.state() !== 'shown') {
      return null;
    }
    const delay = this.delay() + (this.stagger?.delayOf(this) ?? 0);
    const timing = `var(--mt-reveal-duration, 600ms) var(--mt-reveal-easing, cubic-bezier(0.2, 0, 0, 1)) ${delay}ms`;
    return `opacity ${timing}, transform ${timing}`;
  });

  constructor() {
    const element = inject<ElementRef<Element>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (this.reduced() || typeof IntersectionObserver === 'undefined') {
        return;
      }
      // The first callback reports where the element is at load. Only
      // elements fully off screen are hidden, so nothing visible disappears.
      let first = true;
      const observer = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting) {
          this.state.update((state) => (state === 'hidden' ? 'shown' : state));
          observer.disconnect();
        } else if (first) {
          this.state.set('hidden');
        }
        first = false;
      });
      observer.observe(element);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}

/**
 * Staggers the `mtReveal` elements inside it, so they arrive one after
 * another instead of all at once.
 *
 * @example
 * <ul mtStagger="120">
 *   <li mtReveal>…</li>
 *   <li mtReveal>…</li>
 * </ul>
 */
@Directive({ selector: '[mtStagger]' })
export class Stagger {
  /** Milliseconds between one reveal and the next. Defaults to 80. */
  readonly step = input(80, {
    alias: 'mtStagger',
    transform: (value: unknown) => numberAttribute(value, 80),
  });

  private readonly reveals = contentChildren(Reveal, { descendants: true });

  /** The delay for one of its reveals, from its position in the list. */
  delayOf(reveal: Reveal): number {
    return Math.max(0, this.reveals().indexOf(reveal)) * this.step();
  }
}
