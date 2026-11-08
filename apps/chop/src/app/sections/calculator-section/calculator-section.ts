import { Component, computed, effect, signal } from '@angular/core';
import { NdIcon } from '@ndop/core';
import {
  type Circle,
  CONTRIBUTION_STEP,
  EXAMPLE,
  fcfa,
  MAX_CONTRIBUTION,
  MAX_MEMBERS,
  MIN_CONTRIBUTION,
  MIN_MEMBERS,
  MONTHS,
  summary,
  turns,
} from '../../circle/circle';
import { WHEEL, wedges } from '../../circle/wheel';
import { calculator } from '../../content';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendIndicator,
  ChartLegendItem,
  ChartPlot,
  ChartTooltip,
  ChartTooltipBody,
  ChartTooltipItem,
  ChartTooltipLabel,
  ChartTooltipList,
  ChartTooltipName,
  ChartTooltipValue,
  type ChartConfig,
} from '../../ui/chart/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from '../../ui/select/select';
import {
  Slider,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from '../../ui/slider/slider';
import { Toggle } from '../../ui/toggle/toggle';

/**
 * "Your circle", the savings calculator: choose the members, the monthly
 * contribution and the first turn, and the wheel shows each member's turn
 * as a wedge, as long as what they have paid in by then, against the pot
 * at the rim (circle/wheel.ts). The table under it holds the same rows;
 * "Show as a table" puts it on screen in the wheel's place, and without
 * JavaScript it shows the example.
 *
 * The wheel is Ndop's Chart: its container, plot, tooltip and legend. The
 * plot's arrow keys step through the turns; its pointer reads x alone,
 * which doesn't fit a wheel, so each wedge sets the turn it is over.
 */
@Component({
  selector: 'mt-calculator-section',
  imports: [
    ChartContainer,
    ChartLegend,
    ChartLegendIndicator,
    ChartLegendItem,
    ChartPlot,
    ChartTooltip,
    ChartTooltipBody,
    ChartTooltipItem,
    ChartTooltipLabel,
    ChartTooltipList,
    ChartTooltipName,
    ChartTooltipValue,
    NdIcon,
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectItemText,
    SelectTrigger,
    SelectValue,
    Slider,
    SliderRange,
    SliderThumb,
    SliderTrack,
    Toggle,
  ],
  templateUrl: './calculator-section.html',
})
export class CalculatorSection {
  protected readonly copy = calculator;
  protected readonly fcfa = fcfa;
  protected readonly wheel = WHEEL;
  protected readonly limits = {
    members: { min: MIN_MEMBERS, max: MAX_MEMBERS },
    contribution: {
      min: MIN_CONTRIBUTION,
      max: MAX_CONTRIBUTION,
      step: CONTRIBUTION_STEP,
    },
  };
  protected readonly months = MONTHS.map((name, i) => ({
    value: String(i),
    label: `${name} ${calculator.startYear}`,
  }));
  protected readonly config: ChartConfig = {
    paidIn: { label: calculator.legend.paidIn, color: 'var(--chart-1)' },
  };

  protected readonly members = signal(EXAMPLE.members);
  protected readonly contribution = signal(EXAMPLE.contribution);
  /** The first month, as the Select holds it: "0" for January. */
  protected readonly start = signal<string | null>(String(EXAMPLE.start));
  protected readonly asTable = signal(false);
  /** The turn the chart's keys or pointer are on, or `null`. */
  protected readonly active = signal<number | null>(null);

  protected readonly circle = computed<Circle>(() => ({
    members: this.members(),
    contribution: this.contribution(),
    start: Number(this.start() ?? EXAMPLE.start),
  }));
  protected readonly turns = computed(() => turns(this.circle()));
  protected readonly pot = computed(
    () => this.circle().contribution * this.circle().members,
  );
  protected readonly wedges = computed(() => wedges(this.turns()));
  /** The plot's keys step through the turns; their positions don't matter. */
  protected readonly xs = computed(() => this.turns().map((_, i) => i));

  /**
   * Each wedge's month label outside the rim: "Mar", or "Jan ’28" where a
   * new year starts, so a long circle's months don't read as one year. Up
   * to twelve turns every wedge is labelled; past that, only the Januaries.
   */
  protected readonly labels = computed(() => {
    const turns = this.turns();
    return turns.map((turn, i) => {
      const short = turn.month.slice(0, 3);
      const label =
        i > 0 && short === 'Jan' ? `Jan ’${turn.month.slice(-2)}` : short;
      return turns.length <= 12 || short === 'Jan' ? label : '';
    });
  });

  /** The highlighted turn: the active one, or the first at rest. */
  protected readonly highlighted = computed(() => this.active() ?? 0);
  protected readonly current = computed(() => {
    const index = this.active();
    return index === null ? null : (this.turns()[index] ?? null);
  });
  /** Where the tooltip sits, in percent of the wheel: by its wedge's edge. */
  protected readonly tooltipAt = computed(() => {
    const index = this.active();
    const tip = index === null ? undefined : this.wedges()[index]?.tip;
    return tip
      ? { left: (tip.x / WHEEL.size) * 100, top: (tip.y / WHEEL.size) * 100 }
      : { left: 50, top: 50 };
  });
  /** What the live region reads as the chart's keys move. */
  protected readonly currentText = computed(() => {
    const turn = this.current();
    return turn
      ? `${turn.month}, ${calculator.turnOf(turn.member)}: ${calculator.paidIn.toLowerCase()} ${fcfa(turn.paidIn)}, ${calculator.takes.toLowerCase()} ${fcfa(turn.takes)}.`
      : '';
  });

  /** The circle in one sentence, read once the controls settle. */
  protected readonly announcement = signal('');

  constructor() {
    let first = true;
    effect((onCleanup) => {
      const message = summary(this.circle());
      // Not on load: the summary is on screen already, as the example.
      if (first) {
        first = false;
        return;
      }
      const timer = setTimeout(() => this.announcement.set(message), 700);
      onCleanup(() => clearTimeout(timer));
    });
  }

  /** The pointer picks the wedge it is over. */
  protected point(index: number): void {
    this.active.set(index);
  }
}
