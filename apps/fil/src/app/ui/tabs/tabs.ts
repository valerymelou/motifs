import { computed, Directive, input } from '@angular/core';
import {
  NdTabs,
  NdTabsContent,
  NdTabsList,
  NdTabsTrigger,
} from '@ndop/primitives/tabs';
import { cn, variants, type VariantOf } from '../../lib/utils';

/**
 * Tabs (`@ndop/primitives/tabs`): layered sections of content, shown one
 * at a time. Its list of tabs and its panels go inside it.
 *
 * @example
 * ```html
 * <div ndTabs defaultValue="account">
 *   <div ndTabsList aria-label="Settings">
 *     <button ndTabsTrigger value="account">Account</button>
 *     <button ndTabsTrigger value="password">Password</button>
 *   </div>
 *   <div ndTabsContent value="account">…</div>
 *   <div ndTabsContent value="password">…</div>
 * </div>
 * ```
 */
@Directive({
  selector: '[ndTabs]',
  hostDirectives: [
    {
      directive: NdTabs,
      inputs: ['value', 'defaultValue', 'orientation', 'activationMode'],
      outputs: ['valueChange'],
    },
  ],
  host: { 'data-slot': 'tabs', '[class]': 'classes()' },
})
export class Tabs {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'group/tabs flex gap-2 data-[orientation=horizontal]:flex-col',
      this.class(),
    ),
  );
}

/** Class table for {@link TabsList}. */
export const tabsListVariants = variants({
  base: 'group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none',
  variants: {
    variant: {
      default: 'bg-muted',
      line: 'gap-1 bg-transparent',
    },
  },
  defaults: { variant: 'default' },
});

/** Visual style of a {@link TabsList}. */
export type TabsListVariant = VariantOf<typeof tabsListVariants, 'variant'>;

/**
 * The row (or column) of tabs. `line` underlines the selected tab instead
 * of raising it. Name it with `aria-label`.
 *
 * @example
 * ```html
 * <div ndTabsList aria-label="Settings" variant="line">…</div>
 * ```
 */
@Directive({
  selector: '[ndTabsList]',
  hostDirectives: [NdTabsList],
  host: {
    'data-slot': 'tabs-list',
    '[attr.data-variant]': 'variant()',
    '[class]': 'classes()',
  },
})
export class TabsList {
  /** Visual style. */
  readonly variant = input<TabsListVariant>('default');

  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(tabsListVariants({ variant: this.variant() }), this.class()),
  );
}

/**
 * One tab, on a `button`: it shows the panel with the same `value`.
 *
 * @example
 * ```html
 * <button ndTabsTrigger value="account">Account</button>
 * ```
 */
@Directive({
  selector: 'button[ndTabsTrigger]',
  hostDirectives: [{ directive: NdTabsTrigger, inputs: ['value', 'disabled'] }],
  host: { 'data-slot': 'tabs-trigger', '[class]': 'classes()' },
})
export class TabsTrigger {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      'group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent',
      'data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground',
      'after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-end-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100',
      this.class(),
    ),
  );
}

/**
 * The panel of the tab with the same `value`, hidden while that tab isn't
 * selected. It can take focus, so it shows a focus ring.
 *
 * @example
 * ```html
 * <div ndTabsContent value="account">…</div>
 * ```
 */
@Directive({
  selector: '[ndTabsContent]',
  hostDirectives: [{ directive: NdTabsContent, inputs: ['value'] }],
  host: { 'data-slot': 'tabs-content', '[class]': 'classes()' },
})
export class TabsContent {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'flex-1 outline-none',
      'rounded-md focus-visible:ring-[3px] focus-visible:ring-ring/50',
      this.class(),
    ),
  );
}
