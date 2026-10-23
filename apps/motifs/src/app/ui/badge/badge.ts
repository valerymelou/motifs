import { computed, Directive, input } from '@angular/core';
import { cn, variants, type VariantOf } from '../../lib/utils';

/**
 * Class table for {@link Badge}; also usable to style other elements like
 * a badge.
 */
export const badgeVariants = variants({
  base: 'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3',
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
      secondary:
        'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
      destructive:
        'bg-destructive text-destructive-foreground focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90',
      outline:
        'border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      ghost: '[a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 [a&]:hover:underline',
    },
  },
  defaults: { variant: 'default' },
});

/** Visual style of a {@link Badge}. */
export type BadgeVariant = VariantOf<typeof badgeVariants, 'variant'>;

/**
 * Styled badge: a short status, count or label. It only styles its host,
 * so the host keeps its own semantics: a `span` for text, an `a` when it
 * links somewhere, an `li` in a list of badges.
 *
 * @example
 * ```html
 * <span ndBadge variant="secondary">Beta</span>
 * <a ndBadge variant="outline" href="/changelog">v1.2</a>
 * ```
 */
@Directive({
  selector: '[ndBadge]',
  host: {
    'data-slot': 'badge',
    '[attr.data-variant]': 'variant()',
    '[class]': 'classes()',
  },
})
export class Badge {
  /** Visual style. */
  readonly variant = input<BadgeVariant>('default');

  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(badgeVariants({ variant: this.variant() }), this.class()),
  );
}
