import { Component, computed, effect, input, signal } from '@angular/core';
import { counter, pricing, type Region } from '../content';
import { Badge } from '../ui/badge/badge';
import { Textarea } from '../ui/textarea/textarea';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group/toggle-group';
import { segments } from './segments';

const REGIONS = ['west', 'central', 'east', 'southern', 'north'] as const;

// One counter per page today, but ids stay unique if that changes.
let nextId = 0;

/**
 * Type a message and see how it is sent: its encoding, length, parts and
 * cost at the region and volume chosen. The result is announced once typing
 * pauses, not on every key.
 */
@Component({
  selector: 'mt-segment-counter',
  imports: [Badge, Textarea, ToggleGroup, ToggleGroupItem],
  templateUrl: './segment-counter.html',
  host: { class: 'block' },
})
export class SegmentCounter {
  /** The volume's price factor, from the pricing table above. */
  readonly factor = input(1);

  protected readonly copy = counter;
  protected readonly regionNames = pricing.regionNames;
  protected readonly regions = REGIONS;
  protected readonly id = `mt-segment-counter-${nextId++}`;

  protected readonly text = signal<string>(counter.sample);
  protected readonly regionValue = signal<readonly Region[]>(['central']);
  private readonly region = computed<Region>(
    () => this.regionValue()[0] ?? 'central',
  );

  protected readonly result = computed(() => segments(this.text()));
  protected readonly encoding = computed(() =>
    this.result().encoding === 'gsm' ? counter.gsm : counter.ucs2,
  );
  private readonly each = computed(() =>
    pricing.price('sms', this.region(), this.factor()),
  );
  protected readonly cost = computed(() =>
    counter.cost(
      this.result().parts,
      pricing.format(this.each()),
      pricing.format(this.each() * this.result().parts),
    ),
  );

  /** Announced after typing pauses, so a screen reader isn't flooded. */
  protected readonly announcement = signal('');

  constructor() {
    effect((onCleanup) => {
      const message = counter.announce(
        this.encoding(),
        counter.parts(this.result().parts),
        pricing.format(this.each() * this.result().parts),
      );
      const timer = setTimeout(() => this.announcement.set(message), 700);
      onCleanup(() => clearTimeout(timer));
    });
  }

  protected onInput(event: Event): void {
    if (event.target instanceof HTMLTextAreaElement) {
      this.text.set(event.target.value);
    }
  }

  protected setRegion(value: readonly string[]): void {
    const region = REGIONS.find((candidate) => candidate === value[0]);
    this.regionValue.set([region ?? this.region()]);
  }
}
