import { computed, Directive, input } from '@angular/core';
import { NdLabel } from '@ndop/primitives/label';
import { cn } from '../../lib/utils';

/**
 * Styled label. Names its control natively through `for`, and mirrors an
 * `input[ndInput]`'s disabled and invalid state (`@ndop/primitives/label`).
 *
 * @example
 * ```html
 * <label ndLabel for="email">Email</label>
 * ```
 */
@Directive({
  selector: 'label[ndLabel]',
  hostDirectives: [{ directive: NdLabel, inputs: ['for'] }],
  host: { 'data-slot': 'label', '[class]': 'classes()' },
})
export class Label {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      this.class(),
    ),
  );
}
