import { computed, Directive, input } from '@angular/core';
import {
  NdAccordion,
  NdAccordionContent,
  NdAccordionHeader,
  NdAccordionItem,
  NdAccordionTrigger,
} from '@ndop/primitives/accordion';
import { cn } from '../../lib/utils';

/**
 * An accordion (`@ndop/primitives/accordion`): a stack of headed sections
 * that each show or hide their content. One section opens at a time unless
 * it's `multiple`; `collapsible` lets the open one close.
 *
 * @example
 * ```html
 * <div ndAccordion collapsible defaultValue="shipping">
 *   <div ndAccordionItem value="shipping">
 *     <h3 ndAccordionHeader>
 *       <button ndAccordionTrigger>
 *         Shipping <svg ndIcon="chevron-down"></svg>
 *       </button>
 *     </h3>
 *     <div ndAccordionContent>Ships in two days.</div>
 *   </div>
 * </div>
 * ```
 */
@Directive({
  selector: '[ndAccordion]',
  hostDirectives: [
    {
      directive: NdAccordion,
      inputs: ['value', 'defaultValue', 'multiple', 'collapsible', 'disabled'],
      outputs: ['valueChange'],
    },
  ],
  host: { 'data-slot': 'accordion' },
})
export class Accordion {}

/**
 * One section of an accordion, with a line under it.
 *
 * @example
 * ```html
 * <div ndAccordionItem value="shipping">…</div>
 * ```
 */
@Directive({
  selector: '[ndAccordionItem]',
  hostDirectives: [
    { directive: NdAccordionItem, inputs: ['value', 'disabled'] },
  ],
  host: { 'data-slot': 'accordion-item', '[class]': 'classes()' },
})
export class AccordionItem {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('border-b last:border-b-0', this.class()),
  );
}

/**
 * The heading around a section's trigger: an `h2` to `h6` that fits the
 * page's outline.
 *
 * @example
 * ```html
 * <h3 ndAccordionHeader>…</h3>
 * ```
 */
@Directive({
  selector: '[ndAccordionHeader]',
  hostDirectives: [NdAccordionHeader],
  host: { 'data-slot': 'accordion-header', '[class]': 'classes()' },
})
export class AccordionHeader {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() => cn('flex', this.class()));
}

/**
 * The button that opens and closes its section. Put the chevron icon in it,
 * last; it turns over while the section is open.
 *
 * @example
 * ```html
 * <button ndAccordionTrigger>Shipping <svg ndIcon="chevron-down"></svg></button>
 * ```
 */
@Directive({
  selector: 'button[ndAccordionTrigger]',
  hostDirectives: [NdAccordionTrigger],
  host: { 'data-slot': 'accordion-trigger', '[class]': 'classes()' },
})
export class AccordionTrigger {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-start text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
      '[&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:translate-y-0.5 [&>svg]:text-muted-foreground [&>svg]:transition-transform [&>svg]:duration-200',
      this.class(),
    ),
  );
}

/**
 * The content its trigger shows and hides, sliding open and closed.
 *
 * @example
 * ```html
 * <div ndAccordionContent>Ships in two days.</div>
 * ```
 */
@Directive({
  selector: '[ndAccordionContent]',
  hostDirectives: [NdAccordionContent],
  host: { 'data-slot': 'accordion-content', '[class]': 'classes()' },
})
export class AccordionContent {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      // motion-reduce: Ndop's accordion animates even with reduced motion (an Ndop gap, logged in the spec).
      // The data-state variants repeat there, so they outweigh the animation's own.
      'overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:data-[state=closed]:animate-none motion-reduce:data-[state=open]:animate-none',
      // tw-animate-css's accordion keyframes read this height.
      '[--radix-accordion-content-height:var(--nd-accordion-content-height)]',
      // Space below the text as a pseudo-element, which the height
      // animation clips; padding would stay visible at height 0.
      'after:block after:h-4',
      this.class(),
    ),
  );
}
