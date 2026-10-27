import {
  computed,
  Directive,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import {
  NdToggleGroup,
  NdToggleGroupItem,
} from '@ndop/primitives/toggle-group';
import {
  toggleVariants,
  type ToggleSize,
  type ToggleVariant,
} from '../toggle/toggle';
import { cn } from '../../lib/utils';

/**
 * A group of toggle buttons (`@ndop/primitives/toggle-group`): one pressed
 * at most (`type="single"`, the default) or any number
 * (`type="multiple"`). Arrow keys move between items. Its value is always
 * an array of the pressed items' values. Name it with `aria-label`. Its
 * `variant` and `size` apply to every item; with `spacing` 0 (the default)
 * the items join into one bar.
 *
 * @example
 * ```html
 * <div ndToggleGroup type="multiple" aria-label="Text formatting" [(value)]="formatting">
 *   <button ndToggleGroupItem value="bold" aria-label="Toggle bold"><svg ndIcon="bold"></svg></button>
 *   <button ndToggleGroupItem value="italic" aria-label="Toggle italic"><svg ndIcon="italic"></svg></button>
 * </div>
 * ```
 */
@Directive({
  selector: '[ndToggleGroup]',
  hostDirectives: [
    {
      directive: NdToggleGroup,
      inputs: ['value', 'defaultValue', 'type', 'orientation', 'disabled'],
      outputs: ['valueChange'],
    },
  ],
  host: {
    'data-slot': 'toggle-group',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-spacing]': 'spacing()',
    '[style.--gap]': 'spacing()',
    '[class]': 'classes()',
  },
})
export class ToggleGroup {
  /** Visual style of every item. */
  readonly variant = input<ToggleVariant>('default');

  /** Size of every item. */
  readonly size = input<ToggleSize>('default');

  /**
   * Space between items, in Tailwind spacing units; 0 joins them into one
   * bar.
   */
  readonly spacing = input(0, { transform: numberAttribute });

  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=default]:data-[variant=outline]:shadow-xs',
      'data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
      this.class(),
    ),
  );
}

/**
 * One toggle button of a {@link ToggleGroup}, styled like a Toggle with the
 * group's variant and size.
 *
 * @example
 * ```html
 * <button ndToggleGroupItem value="bold" aria-label="Toggle bold">
 *   <svg ndIcon="bold"></svg>
 * </button>
 * ```
 */
@Directive({
  selector: 'button[ndToggleGroupItem]',
  hostDirectives: [
    { directive: NdToggleGroupItem, inputs: ['value', 'disabled'] },
  ],
  host: {
    'data-slot': 'toggle-group-item',
    '[attr.data-variant]': 'resolvedVariant()',
    '[attr.data-size]': 'resolvedSize()',
    '[attr.data-spacing]': 'group.spacing()',
    '[class]': 'classes()',
  },
})
export class ToggleGroupItem {
  /** Visual style, when the group doesn't set one. */
  readonly variant = input<ToggleVariant>();

  /** Size, when the group doesn't set one. */
  readonly size = input<ToggleSize>();

  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly group = inject(ToggleGroup);

  protected readonly resolvedVariant = computed(
    () => this.variant() ?? this.group.variant(),
  );

  protected readonly resolvedSize = computed(
    () => this.size() ?? this.group.size(),
  );

  protected readonly classes = computed(() =>
    cn(
      toggleVariants({
        variant: this.resolvedVariant(),
        size: this.resolvedSize(),
      }),
      'w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10',
      'data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-s-md data-[spacing=0]:last:rounded-e-md data-[spacing=0]:data-[variant=outline]:border-s-0 data-[spacing=0]:data-[variant=outline]:first:border-s',
      this.class(),
    ),
  );
}
