import { computed, Directive, inject, input } from '@angular/core';
import {
  ND_SLIDER,
  NdSlider,
  NdSliderRange,
  NdSliderThumb,
  NdSliderTrack,
} from '@ndop/primitives/slider';
import { cn } from '../../lib/utils';

/**
 * A slider (`@ndop/primitives/slider`): pick a number, or a range with two
 * thumbs, by dragging or with the arrow keys. The root sets `min`, `max`
 * and `step`; each `ndSliderThumb` holds one value, so bind each thumb
 * with `[(value)]` or a forms library, and name it with `aria-label`.
 *
 * @example
 * ```html
 * <div ndSlider [max]="100" [step]="1">
 *   <div ndSliderTrack><div ndSliderRange></div></div>
 *   <span ndSliderThumb aria-label="Volume" [(value)]="volume"></span>
 * </div>
 * ```
 */
@Directive({
  selector: '[ndSlider]',
  hostDirectives: [
    {
      directive: NdSlider,
      inputs: ['min', 'max', 'step', 'orientation', 'disabled'],
    },
  ],
  host: { 'data-slot': 'slider', '[class]': 'classes()' },
})
export class Slider {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
      this.class(),
    ),
  );
}

/**
 * The track of a {@link Slider}, with a `ndSliderRange` inside.
 *
 * @example
 * ```html
 * <div ndSliderTrack><div ndSliderRange></div></div>
 * ```
 */
@Directive({
  selector: '[ndSliderTrack]',
  hostDirectives: [NdSliderTrack],
  host: { 'data-slot': 'slider-track', '[class]': 'classes()' },
})
export class SliderTrack {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5',
      this.class(),
    ),
  );
}

/**
 * The filled part of a {@link Slider}'s track: from the start to a single
 * thumb, or between two.
 *
 * @example
 * ```html
 * <div ndSliderRange></div>
 * ```
 */
@Directive({
  selector: '[ndSliderRange]',
  hostDirectives: [NdSliderRange],
  host: {
    'data-slot': 'slider-range',
    '[style.inset-inline-start.%]': 'horizontal() ? range().start : null',
    '[style.inset-inline-end.%]': 'horizontal() ? 100 - range().end : null',
    '[style.bottom.%]': 'horizontal() ? null : range().start',
    '[style.top.%]': 'horizontal() ? null : 100 - range().end',
    '[class]': 'classes()',
  },
})
export class SliderRange {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  private readonly slider = inject(ND_SLIDER);

  protected readonly range = this.slider.range;

  protected readonly horizontal = computed(
    () => this.slider.orientation() === 'horizontal',
  );

  protected readonly classes = computed(() =>
    cn(
      'absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
      this.class(),
    ),
  );
}

/**
 * A thumb of a {@link Slider}: one value, bound with `[(value)]` or a forms
 * library. Name it with `aria-label`; add a second one for a range. It
 * stays inside the track at both ends.
 *
 * @example
 * ```html
 * <span ndSliderThumb aria-label="Volume" [(value)]="volume"></span>
 * ```
 */
@Directive({
  selector: '[ndSliderThumb]',
  hostDirectives: [
    {
      directive: NdSliderThumb,
      inputs: ['value', 'defaultValue', 'valueText', 'invalid'],
      outputs: ['valueChange'],
    },
  ],
  host: {
    'data-slot': 'slider-thumb',
    // The thumb's edge moves from the track's start to its end, so it
    // never overhangs: positioned at the value's percentage, then pulled
    // back by the same percentage of its own size.
    '[style.inset-inline-start.%]': 'horizontal() ? thumb.percent() : null',
    '[style.bottom.%]': 'horizontal() ? null : thumb.percent()',
    '[style.--slider-thumb-offset]': 'thumb.percent() + "%"',
    '[class]': 'classes()',
  },
})
export class SliderThumb {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly thumb = inject(NdSliderThumb);

  protected readonly horizontal = computed(
    () => this.thumb.slider.orientation() === 'horizontal',
  );

  protected readonly classes = computed(() =>
    cn(
      'block size-4 shrink-0 rounded-full border border-primary bg-background shadow-sm ring-ring/50 transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
      'absolute data-[orientation=horizontal]:-translate-x-(--slider-thumb-offset) rtl:data-[orientation=horizontal]:translate-x-(--slider-thumb-offset) data-[orientation=vertical]:translate-y-(--slider-thumb-offset) aria-disabled:pointer-events-none aria-invalid:border-destructive',
      this.class(),
    ),
  );
}
