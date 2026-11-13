import { computed, Directive, inject, input } from '@angular/core';
import {
  NdToast,
  NdToastAction,
  NdToastClose,
  NdToastDescription,
  NdToastRegion,
  NdToastTitle,
  NdToasterOutlet,
} from '@ndop/primitives/toast';
import { cn } from '../../lib/utils';

export {
  NdToaster as Toaster,
  type NdToastActionOptions as ToastActionOptions,
  type NdToastOptions as ToastOptions,
  type NdToastRecord as ToastRecord,
  type NdToastType as ToastType,
} from '@ndop/primitives/toast';

/**
 * Renders the toast region in its template above everything else, once the
 * app has hydrated. Put one in the app's shell.
 *
 * @example
 * ```html
 * <ng-template ndToaster><section ndToastRegion>…</section></ng-template>
 * ```
 */
@Directive({
  selector: 'ng-template[ndToaster]',
  hostDirectives: [NdToasterOutlet],
})
export class ToasterOutlet {}

/** How many toasts show in the collapsed stack. */
const VISIBLE = 3;

/**
 * The toast region (`@ndop/primitives/toast`), in the corner at the end
 * side, bottom: a polite live region and landmark that F8 focuses. Put it
 * in an `ng-template[ndToaster]` once, in the app's shell, with an `ol` of
 * the toasts in `NdToaster.toasts()`. Hovering it or focusing inside it
 * pauses the toasts and spreads the stack out.
 *
 * @example
 * ```html
 * <ng-template ndToaster>
 *   <section ndToastRegion>
 *     <ol ndToastList>
 *       @for (toast of toaster.toasts(); track toast.id) {
 *         <li [ndToast]="toast">…</li>
 *       }
 *     </ol>
 *   </section>
 * </ng-template>
 * ```
 */
@Directive({
  selector: '[ndToastRegion]',
  hostDirectives: [NdToastRegion],
  host: { 'data-slot': 'toaster', '[class]': 'classes()' },
})
export class ToastRegion {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'toaster group fixed end-4 bottom-4 z-[1100] w-[calc(100%-2rem)] rounded-(--radius) outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:w-[356px]',
      this.class(),
    ),
  );
}

/**
 * The list of toasts: stacked on top of each other, newest in front, and
 * spread out while its region is hovered or focused.
 *
 * @example
 * ```html
 * <ol ndToastList>…</ol>
 * ```
 */
@Directive({
  selector: 'ol[ndToastList]',
  host: { 'data-slot': 'toast-list', '[class]': 'classes()' },
})
export class ToastList {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'grid [grid-template-areas:"stack"] items-end group-data-expanded:flex group-data-expanded:flex-col-reverse group-data-expanded:gap-2',
      this.class(),
    ),
  );
}

/**
 * One toast, styled like Sonner's: in the stack, older toasts sit
 * slightly behind and above the newest, and only three show until the
 * stack spreads out. It follows a swipe toward the end side, which
 * dismisses it past 50 pixels.
 *
 * @example
 * ```html
 * <li [ndToast]="toast">
 *   <svg ndIcon="circle-check"></svg>
 *   <div ndToastContent>
 *     <p ndToastTitle>{{ toast.title }}</p>
 *   </div>
 * </li>
 * ```
 */
@Directive({
  selector: '[ndToast]',
  hostDirectives: [{ directive: NdToast, inputs: ['ndToast'] }],
  host: { 'data-slot': 'toast', '[class]': 'classes()' },
})
export class Toast {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  private readonly toast = inject(NdToast);

  protected readonly classes = computed(() =>
    cn(
      'relative flex w-full items-center gap-3 rounded-(--radius) border border-border bg-popover p-4 text-sm text-popover-foreground shadow-lg [grid-area:stack] [&>svg]:size-4 [&>svg]:shrink-0',
      'z-[calc(100-var(--nd-toast-index))] origin-bottom transition-[translate,scale,opacity] duration-300 ease-out motion-reduce:transition-none data-swiping:transition-none',
      'translate-x-(--nd-toast-swipe) rtl:-translate-x-(--nd-toast-swipe) translate-y-[calc(var(--nd-toast-index)*-14px)] scale-[calc(1-var(--nd-toast-index)*0.05)]',
      'group-data-expanded:translate-y-0 group-data-expanded:scale-100',
      this.toast.index() >= VISIBLE &&
        'pointer-events-none opacity-0 group-data-expanded:pointer-events-auto group-data-expanded:opacity-100',
      this.class(),
    ),
  );
}

/**
 * Stacks a toast's title and description.
 *
 * @example
 * ```html
 * <div ndToastContent>…</div>
 * ```
 */
@Directive({
  selector: '[ndToastContent]',
  host: { 'data-slot': 'toast-content', '[class]': 'classes()' },
})
export class ToastContent {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('grid flex-1 gap-0.5', this.class()),
  );
}

/**
 * A toast's message.
 *
 * @example
 * ```html
 * <p ndToastTitle>{{ toast.title }}</p>
 * ```
 */
@Directive({
  selector: '[ndToastTitle]',
  hostDirectives: [NdToastTitle],
  host: { 'data-slot': 'toast-title', '[class]': 'classes()' },
})
export class ToastTitle {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() => cn('font-medium', this.class()));
}

/**
 * A toast's detail, under its title.
 *
 * @example
 * ```html
 * <p ndToastDescription>{{ toast.description }}</p>
 * ```
 */
@Directive({
  selector: '[ndToastDescription]',
  hostDirectives: [NdToastDescription],
  host: { 'data-slot': 'toast-description', '[class]': 'classes()' },
})
export class ToastDescription {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('text-muted-foreground', this.class()),
  );
}

/**
 * The button of a toast's action, such as Undo: it runs the action, then
 * dismisses the toast.
 *
 * @example
 * ```html
 * <button ndToastAction>{{ action.label }}</button>
 * ```
 */
@Directive({
  selector: 'button[ndToastAction]',
  hostDirectives: [NdToastAction],
  host: { 'data-slot': 'toast-action', '[class]': 'classes()' },
})
export class ToastAction {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'ms-auto inline-flex h-6 shrink-0 items-center rounded-md bg-primary px-2 text-xs font-medium text-primary-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
      this.class(),
    ),
  );
}

/**
 * The button that dismisses its toast, at its top start corner; name it,
 * such as `aria-label="Close"`, and put an icon in it.
 *
 * @example
 * ```html
 * <button ndToastClose aria-label="Close"><svg ndIcon="x"></svg></button>
 * ```
 */
@Directive({
  selector: 'button[ndToastClose]',
  hostDirectives: [NdToastClose],
  host: { 'data-slot': 'toast-close', '[class]': 'classes()' },
})
export class ToastClose {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'absolute -top-2 -start-2 flex size-5 items-center justify-center rounded-full border border-border bg-popover text-popover-foreground opacity-0 transition-opacity outline-none group-data-expanded:opacity-100 focus-visible:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-3',
      this.class(),
    ),
  );
}
