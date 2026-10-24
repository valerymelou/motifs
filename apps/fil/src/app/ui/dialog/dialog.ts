import { computed, Directive, input } from '@angular/core';
import {
  NdDialog,
  NdDialogClose,
  NdDialogContent,
  NdDialogDescription,
  NdDialogOverlay,
  NdDialogPortal,
  NdDialogTitle,
  NdDialogTrigger,
} from '@ndop/primitives/dialog';
import { cn } from '../../lib/utils';

/**
 * A modal dialog (`@ndop/primitives/dialog`): it renders its portal's
 * content over the page while open, traps focus inside it and returns it on
 * close, and closes on Escape or a backdrop click. Put it on an
 * `ng-container`; `open` is two-way bindable.
 *
 * @example
 * ```html
 * <ng-container ndDialog [(open)]="open">…</ng-container>
 * ```
 */
@Directive({
  selector: '[ndDialog]',
  hostDirectives: [
    {
      directive: NdDialog,
      inputs: ['open', 'defaultOpen', 'closeOnEscape', 'closeOnOverlayClick'],
      outputs: ['openChange'],
    },
  ],
})
export class Dialog {}

/**
 * The button that opens its dialog, with `aria-haspopup`, `aria-expanded`
 * and `aria-controls`.
 *
 * @example
 * ```html
 * <button ndButton ndDialogTrigger>Edit profile</button>
 * ```
 */
@Directive({
  selector: '[ndDialogTrigger]',
  hostDirectives: [NdDialogTrigger],
  host: { 'data-slot': 'dialog-trigger' },
})
export class DialogTrigger {}

/**
 * Marks the `ng-template` its dialog renders while open.
 *
 * @example
 * ```html
 * <ng-template ndDialogPortal>…</ng-template>
 * ```
 */
@Directive({
  selector: 'ng-template[ndDialogPortal]',
  hostDirectives: [NdDialogPortal],
})
export class DialogPortal {}

/**
 * A button that closes its dialog.
 *
 * @example
 * ```html
 * <button ndButton variant="outline" ndDialogClose>Cancel</button>
 * ```
 */
@Directive({
  selector: '[ndDialogClose]',
  hostDirectives: [NdDialogClose],
  host: { 'data-slot': 'dialog-close' },
})
export class DialogClose {}

/**
 * Backdrop behind the dialog; a click on it closes the dialog.
 *
 * @example
 * ```html
 * <div ndDialogOverlay></div>
 * ```
 */
@Directive({
  selector: '[ndDialogOverlay]',
  hostDirectives: [NdDialogOverlay],
  host: { 'data-slot': 'dialog-overlay', '[class]': 'classes()' },
})
export class DialogOverlay {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      // motion-reduce: Ndop's overlays animate even with reduced motion (an Ndop gap, logged in the spec).
      'fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none',
      this.class(),
    ),
  );
}

/**
 * The dialog box, centered on screen.
 *
 * @example
 * ```html
 * <div ndDialogContent>…</div>
 * ```
 */
@Directive({
  selector: '[ndDialogContent]',
  hostDirectives: [NdDialogContent],
  host: { 'data-slot': 'dialog-content', '[class]': 'classes()' },
})
export class DialogContent {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      // motion-reduce: Ndop's overlays animate even with reduced motion (an Ndop gap, logged in the spec).
      'fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg motion-reduce:animate-none',
      this.class(),
    ),
  );
}

/**
 * The icon button in the content's corner that closes the dialog. Put an
 * `<svg ndIcon="x">` and a `sr-only` label inside it.
 *
 * @example
 * ```html
 * <button ndDialogCloseButton>
 *   <svg ndIcon="x"></svg>
 *   <span class="sr-only">Close</span>
 * </button>
 * ```
 */
@Directive({
  selector: 'button[ndDialogCloseButton]',
  hostDirectives: [NdDialogClose],
  host: {
    type: 'button',
    'data-slot': 'dialog-close',
    '[class]': 'classes()',
  },
})
export class DialogCloseButton {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      "absolute top-4 end-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      this.class(),
    ),
  );
}

/**
 * Layout for the title and description.
 *
 * @example
 * ```html
 * <div ndDialogHeader>…</div>
 * ```
 */
@Directive({
  selector: '[ndDialogHeader]',
  host: { 'data-slot': 'dialog-header', '[class]': 'classes()' },
})
export class DialogHeader {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('flex flex-col gap-2 text-center sm:text-start', this.class()),
  );
}

/**
 * Layout for the action buttons.
 *
 * @example
 * ```html
 * <div ndDialogFooter>…</div>
 * ```
 */
@Directive({
  selector: '[ndDialogFooter]',
  host: { 'data-slot': 'dialog-footer', '[class]': 'classes()' },
})
export class DialogFooter {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', this.class()),
  );
}

/**
 * The dialog's title; it names the dialog.
 *
 * @example
 * ```html
 * <h2 ndDialogTitle>Edit profile</h2>
 * ```
 */
@Directive({
  selector: '[ndDialogTitle]',
  hostDirectives: [NdDialogTitle],
  host: { 'data-slot': 'dialog-title', '[class]': 'classes()' },
})
export class DialogTitle {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('text-lg leading-none font-semibold', this.class()),
  );
}

/**
 * The dialog's description; it describes the dialog.
 *
 * @example
 * ```html
 * <p ndDialogDescription>Changes are saved when you close.</p>
 * ```
 */
@Directive({
  selector: '[ndDialogDescription]',
  hostDirectives: [NdDialogDescription],
  host: { 'data-slot': 'dialog-description', '[class]': 'classes()' },
})
export class DialogDescription {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('text-sm text-muted-foreground', this.class()),
  );
}
