import { Component, computed, signal } from '@angular/core';
import { fcfa } from '../../circle/circle';
import { type Period, pricing } from '../../content';
import { Badge } from '../../ui/badge/badge';
import { Button } from '../../ui/button/button';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '../../ui/toggle-group/toggle-group';

/** Seats round a ring, as points on a 200-unit square. */
function seats(cx: number, cy: number, r: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 2 * Math.PI;
    return {
      x: Math.round((cx + r * Math.sin(angle)) * 100) / 100,
      y: Math.round((cy - r * Math.cos(angle)) * 100) / 100,
    };
  });
}

/** The Treasurer's ten circles, in rows of four, three, two and one. */
const CLUSTER = [
  [37, 40],
  [79, 40],
  [121, 40],
  [163, 40],
  [58, 82],
  [100, 82],
  [142, 82],
  [79, 124],
  [121, 124],
  [100, 166],
] as const;

/**
 * "Dues": the two plans, monthly or yearly, each drawn as rings rather
 * than as a card: Circle is one ring of up to twenty seats, Treasurer ten
 * small rings. All prices are fictional.
 */
@Component({
  selector: 'mt-pricing-section',
  imports: [Badge, Button, ToggleGroup, ToggleGroupItem],
  templateUrl: './pricing-section.html',
})
export class PricingSection {
  protected readonly copy = pricing;
  protected readonly fcfa = fcfa;
  protected readonly art = {
    circle: [{ cx: 100, cy: 100, r: 74, seats: seats(100, 100, 74, 20) }],
    treasurer: CLUSTER.map(([cx, cy]) => ({
      cx,
      cy,
      r: 18,
      seats: seats(cx, cy, 18, 8),
    })),
  };

  /**
   * The toggle group's pressed value. A period always stays chosen:
   * pressing the pressed one again sets a fresh array, which re-presses it.
   */
  protected readonly value = signal<readonly Period[]>(['monthly']);
  protected readonly period = computed<Period>(
    () => this.value()[0] ?? 'monthly',
  );

  protected setPeriod(value: readonly string[]): void {
    const chosen = pricing.periods.find((option) => option.id === value[0]);
    this.value.set([chosen?.id ?? this.period()]);
  }
}
