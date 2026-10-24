import { computed, Directive, input } from '@angular/core';
import {
  NdCommand,
  NdCommandEmpty,
  NdCommandGroup,
  NdCommandGroupHeading,
  NdCommandInput,
  NdCommandItem,
  NdCommandList,
  NdCommandSeparator,
} from '@ndop/primitives/command';
import { cn } from '../../lib/utils';

/**
 * A command menu (`@ndop/primitives/command`): a search field over a list
 * of commands, filtered as the user types. Put it in a Dialog for a ⌘K
 * palette.
 *
 * @example
 * ```html
 * <div ndCommand label="Commands">
 *   <div ndCommandInputWrapper>
 *     <svg ndIcon="search"></svg>
 *     <input ndCommandInput placeholder="Type a command or search…" />
 *   </div>
 *   <div ndCommandList>
 *     <div ndCommandEmpty>No results found.</div>
 *     <div ndCommandItem (triggered)="open()">Calendar</div>
 *   </div>
 * </div>
 * ```
 */
@Directive({
  selector: '[ndCommand]',
  hostDirectives: [
    {
      directive: NdCommand,
      inputs: ['label', 'search', 'filter', 'shouldFilter', 'loop'],
      outputs: ['searchChange'],
    },
  ],
  host: { 'data-slot': 'command', '[class]': 'classes()' },
})
export class Command {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      this.class(),
    ),
  );
}

/**
 * The row around the search field and its icon.
 *
 * @example
 * ```html
 * <div ndCommandInputWrapper><svg ndIcon="search"></svg>…</div>
 * ```
 */
@Directive({
  selector: '[ndCommandInputWrapper]',
  host: { 'data-slot': 'command-input-wrapper', '[class]': 'classes()' },
})
export class CommandInputWrapper {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'flex h-9 items-center gap-2 border-b px-3',
      '[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:opacity-50',
      this.class(),
    ),
  );
}

/**
 * The search field; focus stays in it while the arrow keys move through
 * the commands.
 *
 * @example
 * ```html
 * <input ndCommandInput placeholder="Type a command or search…" />
 * ```
 */
@Directive({
  selector: 'input[ndCommandInput]',
  hostDirectives: [NdCommandInput],
  host: { 'data-slot': 'command-input', '[class]': 'classes()' },
})
export class CommandInput {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
      this.class(),
    ),
  );
}

/**
 * The scrolling list of commands.
 *
 * @example
 * ```html
 * <div ndCommandList>…</div>
 * ```
 */
@Directive({
  selector: '[ndCommandList]',
  hostDirectives: [NdCommandList],
  host: { 'data-slot': 'command-list', '[class]': 'classes()' },
})
export class CommandList {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto',
      this.class(),
    ),
  );
}

/**
 * What shows while no command matches.
 *
 * @example
 * ```html
 * <div ndCommandEmpty>No results found.</div>
 * ```
 */
@Directive({
  selector: '[ndCommandEmpty]',
  hostDirectives: [NdCommandEmpty],
  host: { 'data-slot': 'command-empty', '[class]': 'classes()' },
})
export class CommandEmpty {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('py-6 text-center text-sm', this.class()),
  );
}

/**
 * A group of commands, named by its {@link CommandGroupHeading}.
 *
 * @example
 * ```html
 * <div ndCommandGroup>
 *   <div ndCommandGroupHeading>Suggestions</div>
 *   …
 * </div>
 * ```
 */
@Directive({
  selector: '[ndCommandGroup]',
  hostDirectives: [NdCommandGroup],
  host: { 'data-slot': 'command-group', '[class]': 'classes()' },
})
export class CommandGroup {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('overflow-hidden p-1 text-foreground', this.class()),
  );
}

/**
 * The heading of a {@link CommandGroup}.
 *
 * @example
 * ```html
 * <div ndCommandGroupHeading>Suggestions</div>
 * ```
 */
@Directive({
  selector: '[ndCommandGroupHeading]',
  hostDirectives: [NdCommandGroupHeading],
  host: { 'data-slot': 'command-group-heading', '[class]': 'classes()' },
})
export class CommandGroupHeading {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', this.class()),
  );
}

/**
 * A line between groups, hidden while searching.
 *
 * @example
 * ```html
 * <div ndCommandSeparator></div>
 * ```
 */
@Directive({
  selector: '[ndCommandSeparator]',
  hostDirectives: [NdCommandSeparator],
  host: { 'data-slot': 'command-separator', '[class]': 'classes()' },
})
export class CommandSeparator {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('-mx-1 h-px bg-border', this.class()),
  );
}

/**
 * One command; `triggered` emits when it runs.
 *
 * @example
 * ```html
 * <div ndCommandItem keywords="emoji" (triggered)="open()">Search emoji</div>
 * ```
 */
@Directive({
  selector: '[ndCommandItem]',
  hostDirectives: [
    {
      directive: NdCommandItem,
      inputs: ['value', 'keywords', 'disabled'],
      outputs: ['triggered'],
    },
  ],
  host: { 'data-slot': 'command-item', '[class]': 'classes()' },
})
export class CommandItem {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
      this.class(),
    ),
  );
}

/**
 * A command's keyboard shortcut, shown at its end. It's text for sighted
 * users; the command doesn't bind it.
 *
 * @example
 * ```html
 * <span ndCommandShortcut>⌘P</span>
 * ```
 */
@Directive({
  selector: '[ndCommandShortcut]',
  host: { 'data-slot': 'command-shortcut', '[class]': 'classes()' },
})
export class CommandShortcut {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('ms-auto text-xs tracking-widest text-muted-foreground', this.class()),
  );
}
