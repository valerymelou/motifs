import { computed, Directive, input } from '@angular/core';
import { NdButton } from '@ndop/primitives/button';
import { cn, variants, type VariantOf } from '../../lib/utils';

/**
 * Class table for {@link Button}; also usable to style other elements like
 * a button.
 */
export const buttonVariants = variants({
  base: "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-disabled:pointer-events-none data-disabled:opacity-50",
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
      outline:
        'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost:
        'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      default: 'h-9 px-4 py-2 has-[>svg]:px-3',
      xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
      sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
      lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
      icon: 'size-9',
      'icon-xs': "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
      'icon-sm': 'size-8',
      'icon-lg': 'size-10',
    },
  },
  defaults: { variant: 'default', size: 'default' },
});

/** Visual style of a {@link Button}. */
export type ButtonVariant = VariantOf<typeof buttonVariants, 'variant'>;

/** Size of a {@link Button}. */
export type ButtonSize = VariantOf<typeof buttonVariants, 'size'>;

/**
 * Styled button for a native `button` or an `a`, with the
 * `@ndop/primitives/button` behavior (safe default type, disabled links).
 *
 * @example
 * ```html
 * <button ndButton variant="outline" size="sm">Cancel</button>
 * <a ndButton variant="link" href="/docs">Docs</a>
 * ```
 */
@Directive({
  selector: 'button[ndButton], a[ndButton]',
  hostDirectives: [{ directive: NdButton, inputs: ['disabled'] }],
  host: {
    'data-slot': 'button',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[class]': 'classes()',
  },
})
export class Button {
  /** Visual style. */
  readonly variant = input<ButtonVariant>('default');

  /** Height, padding and icon size. */
  readonly size = input<ButtonSize>('default');

  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      buttonVariants({ variant: this.variant(), size: this.size() }),
      this.class(),
    ),
  );
}
