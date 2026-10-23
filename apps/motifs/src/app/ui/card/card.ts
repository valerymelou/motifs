import { computed, Directive, input } from '@angular/core';
import { cn } from '../../lib/utils';

/**
 * A card: a bordered surface grouping related content, with optional
 * header, content and footer parts.
 *
 * @example
 * ```html
 * <div ndCard>
 *   <div ndCardHeader>
 *     <h3 ndCardTitle>Notifications</h3>
 *     <p ndCardDescription>You have 3 unread messages.</p>
 *   </div>
 *   <div ndCardContent>…</div>
 *   <div ndCardFooter>…</div>
 * </div>
 * ```
 */
@Directive({
  selector: '[ndCard]',
  host: { 'data-slot': 'card', '[class]': 'classes()' },
})
export class Card {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm',
      this.class(),
    ),
  );
}

/**
 * A card's header: its title, description and an optional action, laid
 * out in a grid.
 *
 * @example
 * ```html
 * <div ndCardHeader>…</div>
 * ```
 */
@Directive({
  selector: '[ndCardHeader]',
  host: { 'data-slot': 'card-header', '[class]': 'classes()' },
})
export class CardHeader {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
      this.class(),
    ),
  );
}

/**
 * A card's title. Put it on the heading element that fits the page's
 * outline.
 *
 * @example
 * ```html
 * <h3 ndCardTitle>Notifications</h3>
 * ```
 */
@Directive({
  selector: '[ndCardTitle]',
  host: { 'data-slot': 'card-title', '[class]': 'classes()' },
})
export class CardTitle {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('leading-none font-semibold', this.class()),
  );
}

/**
 * Supporting text under a card's title.
 *
 * @example
 * ```html
 * <p ndCardDescription>You have 3 unread messages.</p>
 * ```
 */
@Directive({
  selector: '[ndCardDescription]',
  host: { 'data-slot': 'card-description', '[class]': 'classes()' },
})
export class CardDescription {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('text-sm text-muted-foreground', this.class()),
  );
}

/**
 * An action in a card's header, at its end, such as a button or menu.
 *
 * @example
 * ```html
 * <div ndCardAction><button ndButton variant="link">Sign up</button></div>
 * ```
 */
@Directive({
  selector: '[ndCardAction]',
  host: { 'data-slot': 'card-action', '[class]': 'classes()' },
})
export class CardAction {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
      this.class(),
    ),
  );
}

/**
 * A card's main content.
 *
 * @example
 * ```html
 * <div ndCardContent>…</div>
 * ```
 */
@Directive({
  selector: '[ndCardContent]',
  host: { 'data-slot': 'card-content', '[class]': 'classes()' },
})
export class CardContent {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() => cn('px-6', this.class()));
}

/**
 * A card's footer, usually its actions.
 *
 * @example
 * ```html
 * <div ndCardFooter><button ndButton>Save</button></div>
 * ```
 */
@Directive({
  selector: '[ndCardFooter]',
  host: { 'data-slot': 'card-footer', '[class]': 'classes()' },
})
export class CardFooter {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('flex items-center px-6 [.border-t]:pt-6', this.class()),
  );
}
