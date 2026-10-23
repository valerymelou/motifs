import { computed, Directive, input } from '@angular/core';
import { NdToggle } from '@ndop/primitives/toggle';
import { cn, variants, type VariantOf } from '../../lib/utils';

/** Class table for {@link Toggle}, shared with Toggle Group's items. */
// Pressed is also read from aria-pressed: a tooltip on the same button sets
// its own data-state, which hides the toggle's data-state="on" (an Ndop gap,
// logged in the spec).
export const toggleVariants = variants({
  base: "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none hover:bg-muted hover:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground aria-pressed:bg-accent aria-pressed:text-accent-foreground dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  variants: {
    variant: {
      default: 'bg-transparent',
      // Hover uses muted, not accent: on this page accent is the pressed
      // state, and a hovered motif mustn't look chosen.
      outline:
        'border border-input bg-transparent shadow-xs hover:bg-muted hover:text-foreground',
    },
    size: {
      default: 'h-9 min-w-9 px-2',
      sm: 'h-8 min-w-8 px-1.5',
      lg: 'h-10 min-w-10 px-2.5',
    },
  },
  defaults: { variant: 'default', size: 'default' },
});

/** Visual style of a {@link Toggle}. */
export type ToggleVariant = VariantOf<typeof toggleVariants, 'variant'>;

/** Size of a {@link Toggle}. */
export type ToggleSize = VariantOf<typeof toggleVariants, 'size'>;

/**
 * A toggle button (`@ndop/primitives/toggle`): pressed or released,
 * announced with `aria-pressed`. Bind it with `[(pressed)]`. Keep its name
 * the same in both states, such as `aria-label="Toggle bold"`.
 *
 * @example
 * ```html
 * <button ndToggle aria-label="Toggle bold" [(pressed)]="bold">
 *   <svg ndIcon="bold"></svg>
 * </button>
 * ```
 */
@Directive({
  selector: 'button[ndToggle]',
  hostDirectives: [
    {
      directive: NdToggle,
      inputs: ['pressed', 'defaultPressed', 'disabled'],
      outputs: ['pressedChange'],
    },
  ],
  host: {
    'data-slot': 'toggle',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[class]': 'classes()',
  },
})
export class Toggle {
  /** Visual style. */
  readonly variant = input<ToggleVariant>('default');

  /** Size. */
  readonly size = input<ToggleSize>('default');

  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      toggleVariants({ variant: this.variant(), size: this.size() }),
      this.class(),
    ),
  );
}
