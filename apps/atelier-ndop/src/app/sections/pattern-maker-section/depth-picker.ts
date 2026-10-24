import { Component, computed, linkedSignal, model } from '@angular/core';
import { patternMaker } from '../../content';
import { DEPTHS, depthOf, type IndigoDepth } from '../../pattern/pattern';
import { Button } from '../../ui/button/button';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '../../ui/popover/popover';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '../../ui/toggle-group/toggle-group';

/** The depth of indigo: a button showing the current one, and a popover of all four. */
@Component({
  selector: 'mt-depth-picker',
  imports: [
    Button,
    Popover,
    PopoverContent,
    PopoverPortal,
    PopoverTrigger,
    ToggleGroup,
    ToggleGroupItem,
  ],
  templateUrl: './depth-picker.html',
})
export class DepthPicker {
  readonly depth = model.required<IndigoDepth>();

  protected readonly copy = patternMaker;
  protected readonly depths = DEPTHS;
  protected readonly current = computed(() => depthOf(this.depth()));
  /**
   * The toggle group's pressed value. A depth always stays chosen: pressing
   * the pressed swatch again sets a fresh array, which re-presses it.
   */
  protected readonly value = linkedSignal<readonly IndigoDepth[]>(() => [
    this.depth(),
  ]);

  protected setDepth(value: readonly string[]): void {
    const depth =
      DEPTHS.find((candidate) => candidate.depth === value[0])?.depth ??
      this.depth();
    this.value.set([depth]);
    this.depth.set(depth);
  }
}
