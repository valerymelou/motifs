import { computed, Directive, input } from '@angular/core';
import {
  NdPopover,
  NdPopoverClose,
  NdPopoverContent,
  NdPopoverPortal,
  NdPopoverTrigger,
} from '@ndop/primitives/popover';
import { cn } from '../../lib/utils';

/**
 * A popover (`@ndop/primitives/popover`): rich content anchored to its
 * trigger, opened and closed with it. Put it on an `ng-container`; `open`
 * is two-way bindable.
 *
 * @example
 * ```html
 * <ng-container ndPopover>…</ng-container>
 * ```
 */
@Directive({
  selector: '[ndPopover]',
  hostDirectives: [
    {
      directive: NdPopover,
      inputs: ['open', 'defaultOpen'],
      outputs: ['openChange'],
    },
  ],
})
export class Popover {}

/**
 * The button that opens and closes its popover.
 *
 * @example
 * ```html
 * <button ndButton variant="outline" ndPopoverTrigger>Filters</button>
 * ```
 */
@Directive({
  selector: '[ndPopoverTrigger]',
  hostDirectives: [NdPopoverTrigger],
  host: { 'data-slot': 'popover-trigger' },
})
export class PopoverTrigger {}

/**
 * Marks the `ng-template` its popover renders while open.
 *
 * @example
 * ```html
 * <ng-template ndPopoverPortal>…</ng-template>
 * ```
 */
@Directive({
  selector: 'ng-template[ndPopoverPortal]',
  hostDirectives: [NdPopoverPortal],
})
export class PopoverPortal {}

/**
 * A button that closes its popover.
 *
 * @example
 * ```html
 * <button ndButton ndPopoverClose>Done</button>
 * ```
 */
@Directive({
  selector: '[ndPopoverClose]',
  hostDirectives: [NdPopoverClose],
  host: { 'data-slot': 'popover-close' },
})
export class PopoverClose {}

/**
 * The popover panel, placed next to its trigger.
 *
 * @example
 * ```html
 * <div ndPopoverContent align="start" aria-label="Filters">…</div>
 * ```
 */
@Directive({
  selector: '[ndPopoverContent]',
  hostDirectives: [
    { directive: NdPopoverContent, inputs: ['side', 'align', 'sideOffset'] },
  ],
  host: { 'data-slot': 'popover-content', '[class]': 'classes()' },
})
export class PopoverContent {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      // motion-reduce: Ndop's overlays animate even with reduced motion (an Ndop gap, logged in the spec).
      'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=start]:slide-in-from-end-2 data-[side=end]:slide-in-from-start-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-reduce:animate-none',
      this.class(),
    ),
  );
}

/**
 * Layout for the popover's title and description.
 *
 * @example
 * ```html
 * <div ndPopoverHeader>…</div>
 * ```
 */
@Directive({
  selector: '[ndPopoverHeader]',
  host: { 'data-slot': 'popover-header', '[class]': 'classes()' },
})
export class PopoverHeader {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('flex flex-col gap-1 text-sm', this.class()),
  );
}

/**
 * The popover's title. Point the content's `aria-labelledby` at it.
 *
 * @example
 * ```html
 * <h2 ndPopoverTitle id="filters-title">Filters</h2>
 * ```
 */
@Directive({
  selector: '[ndPopoverTitle]',
  host: { 'data-slot': 'popover-title', '[class]': 'classes()' },
})
export class PopoverTitle {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() => cn('font-medium', this.class()));
}

/**
 * Supporting text under the popover's title.
 *
 * @example
 * ```html
 * <p ndPopoverDescription>Narrow the results.</p>
 * ```
 */
@Directive({
  selector: '[ndPopoverDescription]',
  host: { 'data-slot': 'popover-description', '[class]': 'classes()' },
})
export class PopoverDescription {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('text-muted-foreground', this.class()),
  );
}
