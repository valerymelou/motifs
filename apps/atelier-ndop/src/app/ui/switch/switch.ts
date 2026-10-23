import { computed, Directive, input } from '@angular/core';
import { NdSwitch, NdSwitchThumb } from '@ndop/primitives/switch';
import { cn } from '../../lib/utils';

/**
 * A switch on a native `button` (`@ndop/primitives/switch`): an on/off
 * setting that applies at once. Bind it with `[(checked)]` or any forms
 * library, name it with a `label[ndLabel]`, and put a `ndSwitchThumb`
 * inside.
 *
 * @example
 * ```html
 * <button ndSwitch id="airplane" [(checked)]="airplaneMode">
 *   <span ndSwitchThumb></span>
 * </button>
 * <label ndLabel for="airplane">Airplane Mode</label>
 * ```
 */
@Directive({
  selector: 'button[ndSwitch]',
  hostDirectives: [
    {
      directive: NdSwitch,
      inputs: [
        'checked',
        'defaultChecked',
        'disabled',
        'required',
        'invalid',
        'id',
      ],
      outputs: ['checkedChange'],
    },
  ],
  host: {
    'data-slot': 'switch',
    '[attr.data-size]': 'size()',
    '[class]': 'classes()',
  },
})
export class Switch {
  /** Size: `default`, or `sm` for dense layouts. */
  readonly size = input<'default' | 'sm'>('default');

  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'peer group/switch inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[1.15rem] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80',
      'aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
      this.class(),
    ),
  );
}

/**
 * The thumb of a {@link Switch}. It moves to the end side when on, so to
 * the left in right-to-left layouts.
 *
 * @example
 * ```html
 * <span ndSwitchThumb></span>
 * ```
 */
@Directive({
  selector: '[ndSwitchThumb]',
  hostDirectives: [NdSwitchThumb],
  host: { 'data-slot': 'switch-thumb', '[class]': 'classes()' },
})
export class SwitchThumb {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground',
      'rtl:data-[state=checked]:-translate-x-[calc(100%-2px)]',
      this.class(),
    ),
  );
}
