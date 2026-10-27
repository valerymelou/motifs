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
import { calculator } from '../../content';
import {
  ChartContainer,
  ChartCursor,
  ChartGrid,
  ChartLabel,
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
  ChartAxis,
  scaleBand,
  scaleLinear,
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

/** The plot's size in viewBox units; the SVG scales it to the column. */
const WIDTH = 640;
const HEIGHT = 280;
/** Room above the pot line, so its dashes aren't cut. */
const TOP = 4;

/**
 * The savings calculator, the page's signature moment: choose the members,
 * the monthly contribution and the first turn, and a bar chart shows what
 * each member has paid in by their turn against the pot they take. The
 * table under it holds the same rows; "Show as a table" puts it on screen
 * in the chart's place, and without JavaScript it shows the example.
 */
@Component({
  selector: 'mt-calculator-section',
  imports: [
    ChartAxis,
    ChartContainer,
    ChartCursor,
    ChartGrid,
    ChartLabel,
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
  protected readonly width = WIDTH;
  protected readonly height = HEIGHT;
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

  /** One band per turn, keyed by month, which is unique in a circle. */
  protected readonly x = computed(() =>
    scaleBand(
      this.turns().map((turn) => turn.month),
      [0, WIDTH],
      { inner: 0.25, outer: 0.15 },
    ),
  );
  /** From zero to the pot exactly, so the last bar meets the line. */
  protected readonly y = computed(() =>
    scaleLinear([0, this.pot()], [HEIGHT, TOP], false),
  );
  protected readonly centers = computed(() => {
    const x = this.x();
    return this.turns().map((turn) => x(turn.month) + x.bandwidth / 2);
  });
  /** Gridlines at quarters of the pot. */
  protected readonly grid = computed(() =>
    [0.25, 0.5, 0.75].map((share) => this.y()(this.pot() * share)),
  );
  /**
   * Which bars get a month label: all of them up to twelve turns; past
   * that, every other one, but always each January, which names its year,
   * and never the bars beside it.
   */
  protected readonly labelled = computed(() => {
    const months = this.turns().map((turn) => turn.month);
    if (months.length <= 12) {
      return months.map(() => true);
    }
    const january = months.map((month) => month.startsWith('January'));
    return months.map(
      (_, i) =>
        january[i] || (i % 2 === 0 && !january[i - 1] && !january[i + 1]),
    );
  });

  /**
   * A month's label under its bar: "Mar", or "Jan ’28" where a new year
   * starts, so a long circle's months don't read as one year.
   */
  protected axisLabel(month: string, index: number): string {
    const short = month.slice(0, 3);
    return index > 0 && short === 'Jan' ? `Jan ’${month.slice(-2)}` : short;
  }

  /** The highlighted turn: the active one, or the first at rest. */
  protected readonly highlighted = computed(() => this.active() ?? 0);
  protected readonly current = computed(() => {
    const index = this.active();
    return index === null ? null : (this.turns()[index] ?? null);
  });
  protected readonly tooltipLeft = computed(() => {
    const index = this.active();
    return index === null ? 0 : ((this.centers()[index] ?? 0) / WIDTH) * 100;
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
}
