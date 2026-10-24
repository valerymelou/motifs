import { Component, computed, signal } from '@angular/core';
import { pricing, type Volume } from '../../content';
import { SegmentCounter } from '../../counter/segment-counter';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table/table';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '../../ui/toggle-group/toggle-group';

const REGIONS = ['west', 'central', 'east', 'southern', 'north'] as const;

/**
 * Prices per message by type and region, at the volume the visitor picks,
 * and the segment counter under them. All prices are fictional.
 */
@Component({
  selector: 'mt-pricing-section',
  imports: [
    SegmentCounter,
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
    ToggleGroup,
    ToggleGroupItem,
  ],
  templateUrl: './pricing-section.html',
})
export class PricingSection {
  protected readonly copy = pricing;
  protected readonly regions = REGIONS;

  /**
   * The toggle group's pressed value. A volume always stays chosen:
   * pressing the pressed one again sets a fresh array, which re-presses it.
   */
  protected readonly value = signal<readonly Volume[]>(['start']);
  protected readonly volume = computed(
    () =>
      pricing.volumes.find((option) => option.id === this.value()[0]) ??
      pricing.volumes[0],
  );

  protected setVolume(value: readonly string[]): void {
    const chosen =
      pricing.volumes.find((option) => option.id === value[0]) ?? this.volume();
    this.value.set([chosen.id]);
  }
}
