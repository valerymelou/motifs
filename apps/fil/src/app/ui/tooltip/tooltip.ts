import { computed, Directive, input } from '@angular/core';
import {
  NdTooltip,
  NdTooltipContent,
  NdTooltipPortal,
  NdTooltipTrigger,
} from '@ndop/primitives/tooltip';
import { cn } from '../../lib/utils';

/**
 * A tooltip (`@ndop/primitives/tooltip`): a short description of its
 * trigger, shown after a delay on hover and at once on keyboard focus. Put
 * it on an `ng-container`.
 *
 * @example
 * ```html
 * <ng-container ndTooltip>…</ng-container>
 * ```
 */
@Directive({
  selector: '[ndTooltip]',
  hostDirectives: [
    {
      directive: NdTooltip,
      inputs: ['open', 'defaultOpen', 'openDelay', 'closeDelay'],
      outputs: ['openChange'],
    },
  ],
})
export class Tooltip {}

/**
 * The element its tooltip describes, which shows it on hover and focus.
 *
 * @example
 * ```html
 * <button ndButton ndTooltipTrigger>Add to library</button>
 * ```
 */
@Directive({
  selector: '[ndTooltipTrigger]',
  hostDirectives: [NdTooltipTrigger],
  host: { 'data-slot': 'tooltip-trigger' },
})
export class TooltipTrigger {}

/**
 * Marks the `ng-template` its tooltip renders while open.
 *
 * @example
 * ```html
 * <ng-template ndTooltipPortal>…</ng-template>
 * ```
 */
@Directive({
  selector: 'ng-template[ndTooltipPortal]',
  hostDirectives: [NdTooltipPortal],
})
export class TooltipPortal {}

/**
 * The tooltip bubble.
 *
 * @example
 * ```html
 * <div ndTooltipContent>Delete permanently</div>
 * ```
 */
@Directive({
  selector: '[ndTooltipContent]',
  hostDirectives: [
    { directive: NdTooltipContent, inputs: ['side', 'align', 'sideOffset'] },
  ],
  host: { 'data-slot': 'tooltip-content', '[class]': 'classes()' },
})
export class TooltipContent {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      // motion-reduce: Ndop's overlays animate even with reduced motion (an Ndop gap, logged in the spec).
      'z-50 w-fit animate-in rounded-md bg-foreground px-3 py-1.5 text-xs text-balance text-background fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=start]:slide-in-from-end-2 data-[side=end]:slide-in-from-start-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 motion-reduce:animate-none',
      this.class(),
    ),
  );
}
