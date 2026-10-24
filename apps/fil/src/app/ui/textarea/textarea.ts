import { computed, Directive, input } from '@angular/core';
import { cn } from '../../lib/utils';

/**
 * Styled multi-line text field (`@ndop/primitives/input`). It grows with
 * its content (`field-sizing: content`) from a two-line minimum. Forms bind
 * the native `textarea`; invalid and disabled states show once the bound
 * field reports them, and a `label[ndLabel]` with a matching `for` follows
 * them too.
 *
 * @example
 * ```html
 * <label ndLabel for="bio">Bio</label>
 * <textarea ndTextarea id="bio" [formField]="form.bio"></textarea>
 * ```
 */
@Directive({
  selector: 'textarea[ndTextarea]',
  // No NdInput host directive: it mirrors a bound form field's state
  // through @angular/forms, and this page's textarea belongs to no form.
  // Importing it costs about 9 kB gzip of initial JS (an Ndop gap, logged
  // in the spec). `id` is the native attribute instead.
  host: { 'data-slot': 'textarea', '[class]': 'classes()' },
})
export class Textarea {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
      this.class(),
    ),
  );
}
