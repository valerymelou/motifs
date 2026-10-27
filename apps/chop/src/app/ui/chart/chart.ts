import {
  booleanAttribute,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  model,
} from '@angular/core';
import { cn } from '../../lib/utils';

export {
  arcPath,
  areaPath,
  extent,
  linePath,
  niceTicks,
  pieArcs,
  scaleBand,
  scaleLinear,
  scaleTime,
  stack,
  type BandPadding,
  type BandScale,
  type ChartArc,
  type ChartCurve,
  type ChartPoint,
  type LinearScale,
  type PieOptions,
  type TimeScale,
} from '../../lib/chart';

/** A series' label and color, by its key. */
export type ChartConfig = Record<
  string,
  {
    /** The series' name, for tooltips and legends. */
    readonly label?: string;
    /** A CSS color, such as `var(--chart-1)`. */
    readonly color?: string;
    /** Colors for the light and dark themes, used with `light-dark()`. */
    readonly theme?: { readonly light: string; readonly dark: string };
  }
>;

/**
 * A chart's frame: it sets `--color-<key>` for each series in `config`,
 * so the SVG, tooltip and legend use `var(--color-desktop)`, and keeps
 * a video aspect ratio. Put it on a `figure` with a `figcaption`.
 *
 * @example
 * ```html
 * <figure ndChartContainer [config]="config">
 *   <figcaption>Visitors</figcaption>
 *   <svg ndChartPlot viewBox="0 0 500 225">…</svg>
 *   <div ndChartAxis>…</div>
 * </figure>
 * ```
 */
@Directive({
  selector: '[ndChartContainer]',
  host: {
    'data-slot': 'chart',
    '[style]': 'colors()',
    '[class]': 'classes()',
  },
})
export class ChartContainer {
  /** Each series' label and color, by key. */
  readonly config = input<ChartConfig>({});

  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly colors = computed(() =>
    Object.fromEntries(
      Object.entries(this.config()).flatMap(([key, item]) => {
        const color = item.theme
          ? `light-dark(${item.theme.light}, ${item.theme.dark})`
          : item.color;
        return color ? [[`--color-${key}`, color]] : [];
      }),
    ),
  );

  protected readonly classes = computed(() =>
    cn(
      'relative flex aspect-video justify-center text-xs [&_svg]:overflow-visible',
      this.class(),
    ),
  );
}

/**
 * The plot, on the chart's `svg`: one tab stop where the arrow keys,
 * `Home` and `End` move between data points and the pointer picks the
 * nearest one, setting `active`. Bind a tooltip and a polite live region
 * to `active`, so the keyboard and screen readers reach each value. Give
 * it `xs`, each point's horizontal position in `viewBox` units, and name
 * it with `aria-label` or `aria-labelledby`.
 *
 * It spans the chart's width at its `viewBox`'s aspect ratio, so a
 * position in `viewBox` units is the same percentage of the plot's box,
 * where the HTML labels and the tooltip go. For a fixed height instead,
 * set one with a class and `preserveAspectRatio="none"`, and give your
 * lines and outlines `vector-effect="non-scaling-stroke"` so they keep
 * their width, as the grid and cursor do.
 *
 * @example
 * ```html
 * <svg ndChartPlot viewBox="0 0 500 225" [xs]="xs()" [(active)]="active" aria-label="Visitors by month">…</svg>
 * ```
 */
@Directive({
  selector: 'svg[ndChartPlot]',
  host: {
    'data-slot': 'chart-plot',
    role: 'group',
    tabindex: '0',
    '[attr.data-active]': 'active()',
    '[class]': 'classes()',
    '(keydown)': 'keydown($event)',
    '(pointermove)': 'pointer($event)',
    '(pointerleave)': 'leave()',
    '(focus)': 'focus()',
    '(blur)': 'active.set(null)',
  },
})
export class ChartPlot {
  /** Each data point's horizontal position, in `viewBox` units. */
  readonly xs = input<readonly number[]>([]);

  /** The index of the active data point, or `null`. Two-way bindable. */
  readonly active = model<number | null>(null);

  /**
   * Whether the pointer picks the point nearest it horizontally; turn it
   * off for pies, whose slices set `active` on hover themselves.
   */
  readonly trackPointer = input(true, { transform: booleanAttribute });

  /** Extra classes, merged last so they win. */
  readonly class = input('');

  private readonly element =
    inject<ElementRef<SVGSVGElement>>(ElementRef).nativeElement;

  protected readonly classes = computed(() =>
    cn(
      'block h-auto w-full rounded-md outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/50',
      this.class(),
    ),
  );

  /**
   * Moves between data points with the arrow keys, `Home` and `End`.
   *
   * @param event - The keydown event.
   */
  protected keydown(event: KeyboardEvent): void {
    const last = this.xs().length - 1;
    const current = this.active() ?? 0;
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = Math.min(last, current + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = Math.max(0, current - 1);
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
      case 'Escape':
        this.active.set(null);
        return;
      default:
        return;
    }
    event.preventDefault();
    this.active.set(next);
  }

  /**
   * Picks the data point nearest the pointer.
   *
   * @param event - The pointermove event.
   */
  protected pointer(event: PointerEvent): void {
    const matrix = this.element.getScreenCTM?.();
    const xs = this.xs();
    if (!this.trackPointer() || !matrix || xs.length === 0) {
      return;
    }
    // From screen pixels to viewBox units, whatever the SVG's size.
    const x = (event.clientX - matrix.e) / matrix.a;
    let nearest = 0;
    xs.forEach((value, index) => {
      if (Math.abs(value - x) < Math.abs((xs[nearest] as number) - x)) {
        nearest = index;
      }
    });
    this.active.set(nearest);
  }

  /** Clears the active point when the pointer leaves, unless focused. */
  protected leave(): void {
    if (this.element.ownerDocument.activeElement !== this.element) {
      this.active.set(null);
    }
  }

  /** Activates the first point when focus arrives from the keyboard. */
  protected focus(): void {
    if (this.active() === null && this.xs().length > 0) {
      this.active.set(0);
    }
  }
}

/**
 * The grid lines behind the data, on a `g`. They stay a pixel wide
 * whatever the plot's size.
 *
 * @example
 * ```html
 * <g ndChartGrid>…<line /></g>
 * ```
 */
@Directive({
  selector: '[ndChartGrid]',
  host: { 'data-slot': 'chart-grid', '[class]': 'classes()' },
})
export class ChartGrid {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      '[&_line]:stroke-border/50 [&_line]:[vector-effect:non-scaling-stroke]',
      this.class(),
    ),
  );
}

/**
 * The x axis' labels, in a band under the plot. They're HTML rather than
 * SVG text, so they keep their size at every width instead of scaling
 * with the plot. Put a `ChartLabel` in it for each tick, at the tick's
 * position across the plot in percent. Screen readers skip it: the
 * chart's table holds the same labels.
 *
 * @example
 * ```html
 * <div ndChartAxis>
 *   <span ndChartLabel [style.left.%]="(x / width) * 100">Jan</span>
 * </div>
 * ```
 */
@Directive({
  selector: '[ndChartAxis]',
  host: {
    'data-slot': 'chart-axis',
    'aria-hidden': 'true',
    '[class]': 'classes()',
  },
})
export class ChartAxis {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('relative h-4 text-muted-foreground', this.class()),
  );
}

/**
 * A label at a point of the chart, such as an axis tick or a value, in
 * HTML so it keeps its size at every width. It sits at its `left`, a
 * percentage of the plot's width, centered on it by default; a label at
 * the plot's edge aligns `left` or `right` instead, so it stays within
 * the plot. In a `ChartAxis` it sits at the top of the band. Over the
 * plot, put the plot and the label in a `relative` box and set its `top`
 * too, centering it with `-translate-y-1/2`.
 *
 * Like the plot, it isn't mirrored in right-to-left layouts, so it's
 * placed with `left` and aligns to physical sides, not `start` and `end`.
 *
 * @example
 * ```html
 * <span ndChartLabel [style.left.%]="0" align="left">Jan</span>
 * <span ndChartLabel [style.left.%]="50">Apr</span>
 * <span ndChartLabel [style.left.%]="100" align="right">Jun</span>
 * ```
 */
@Directive({
  selector: '[ndChartLabel]',
  host: {
    'data-slot': 'chart-label',
    '[attr.data-align]': 'align()',
    '[class]': 'classes()',
  },
})
export class ChartLabel {
  /**
   * Which of its sides is at its `left`: `center` for its middle, `left`
   * for its left edge (it extends right), `right` for its right edge.
   */
  readonly align = input<'center' | 'left' | 'right'>('center');

  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'pointer-events-none absolute top-0 whitespace-nowrap',
      this.align() === 'center' && '-translate-x-1/2',
      this.align() === 'right' && '-translate-x-full',
      this.class(),
    ),
  );
}

/**
 * The marker of the active data point: a line, which stays a pixel
 * wide whatever the plot's size, or a band behind bars.
 *
 * @example
 * ```html
 * <rect ndChartCursor kind="band" … />
 * ```
 */
@Directive({
  selector: '[ndChartCursor]',
  host: {
    'data-slot': 'chart-cursor',
    'aria-hidden': 'true',
    '[attr.data-kind]': 'kind()',
    '[class]': 'classes()',
  },
})
export class ChartCursor {
  /** `line` for line and area charts, `band` for bars. */
  readonly kind = input<'line' | 'band'>('line');

  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'pointer-events-none data-[kind=band]:fill-muted data-[kind=line]:stroke-border data-[kind=line]:[vector-effect:non-scaling-stroke]',
      this.class(),
    ),
  );
}

/**
 * The tooltip of the active data point, drawn over the chart. It's for
 * sighted users; a polite live region tells screen readers the same.
 *
 * @example
 * ```html
 * <div ndChartTooltip [style.left.%]="left()">…</div>
 * ```
 */
@Directive({
  selector: '[ndChartTooltip]',
  host: {
    'data-slot': 'chart-tooltip',
    'aria-hidden': 'true',
    '[class]': 'classes()',
  },
})
export class ChartTooltip {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl',
      'pointer-events-none absolute top-0 z-10 -translate-x-1/2',
      this.class(),
    ),
  );
}

/**
 * The tooltip's heading, such as the month.
 *
 * @example
 * ```html
 * <div ndChartTooltipLabel>January</div>
 * ```
 */
@Directive({
  selector: '[ndChartTooltipLabel]',
  host: { 'data-slot': 'chart-tooltip-label', '[class]': 'classes()' },
})
export class ChartTooltipLabel {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() => cn('font-medium', this.class()));
}

/**
 * The list of a tooltip's series.
 *
 * @example
 * ```html
 * <div ndChartTooltipList>…</div>
 * ```
 */
@Directive({
  selector: '[ndChartTooltipList]',
  host: { 'data-slot': 'chart-tooltip-list', '[class]': 'classes()' },
})
export class ChartTooltipList {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() => cn('grid gap-1.5', this.class()));
}

/**
 * One series in a tooltip: its indicator, name and value.
 *
 * @example
 * ```html
 * <div ndChartTooltipItem>…</div>
 * ```
 */
@Directive({
  selector: '[ndChartTooltipItem]',
  host: { 'data-slot': 'chart-tooltip-item', '[class]': 'classes()' },
})
export class ChartTooltipItem {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground',
      'items-center',
      this.class(),
    ),
  );
}

/**
 * A series' color swatch in a tooltip: a `dot`, a `line` or a `dashed`
 * line.
 *
 * @example
 * ```html
 * <span ndChartTooltipIndicator color="var(--color-desktop)"></span>
 * ```
 */
@Directive({
  selector: '[ndChartTooltipIndicator]',
  host: {
    'data-slot': 'chart-tooltip-indicator',
    '[style.--color-bg]': 'color()',
    '[style.--color-border]': 'color()',
    '[class]': 'classes()',
  },
})
export class ChartTooltipIndicator {
  /** Its shape. */
  readonly indicator = input<'dot' | 'line' | 'dashed'>('dot');

  /** The series' color. */
  readonly color = input('currentColor');

  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)',
      this.indicator() === 'dot' && 'h-2.5 w-2.5',
      this.indicator() === 'line' && 'w-1',
      this.indicator() === 'dashed' &&
        'w-0 border-[1.5px] border-dashed bg-transparent',
      this.class(),
    ),
  );
}

/**
 * The name and value of a series in a tooltip, spread across its width.
 *
 * @example
 * ```html
 * <div ndChartTooltipBody>
 *   <span ndChartTooltipName>Desktop</span>
 *   <span ndChartTooltipValue>186</span>
 * </div>
 * ```
 */
@Directive({
  selector: '[ndChartTooltipBody]',
  host: { 'data-slot': 'chart-tooltip-body', '[class]': 'classes()' },
})
export class ChartTooltipBody {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'flex flex-1 justify-between leading-none',
      'items-center',
      this.class(),
    ),
  );
}

/**
 * A series' name in a tooltip.
 *
 * @example
 * ```html
 * <span ndChartTooltipName>Desktop</span>
 * ```
 */
@Directive({
  selector: '[ndChartTooltipName]',
  host: { 'data-slot': 'chart-tooltip-name', '[class]': 'classes()' },
})
export class ChartTooltipName {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('text-muted-foreground', this.class()),
  );
}

/**
 * A series' value in a tooltip, in tabular figures.
 *
 * @example
 * ```html
 * <span ndChartTooltipValue>186</span>
 * ```
 */
@Directive({
  selector: '[ndChartTooltipValue]',
  host: { 'data-slot': 'chart-tooltip-value', '[class]': 'classes()' },
})
export class ChartTooltipValue {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('font-mono font-medium text-foreground tabular-nums', this.class()),
  );
}

/**
 * The legend: the series' swatches and names, under the chart.
 *
 * @example
 * ```html
 * <ul ndChartLegend>…</ul>
 * ```
 */
@Directive({
  selector: '[ndChartLegend]',
  host: { 'data-slot': 'chart-legend', '[class]': 'classes()' },
})
export class ChartLegend {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('flex items-center justify-center gap-4', 'pt-3', this.class()),
  );
}

/**
 * One series in the legend.
 *
 * @example
 * ```html
 * <li ndChartLegendItem>…</li>
 * ```
 */
@Directive({
  selector: '[ndChartLegendItem]',
  host: { 'data-slot': 'chart-legend-item', '[class]': 'classes()' },
})
export class ChartLegendItem {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground',
      this.class(),
    ),
  );
}

/**
 * A series' color swatch in the legend.
 *
 * @example
 * ```html
 * <span ndChartLegendIndicator color="var(--color-desktop)"></span>
 * ```
 */
@Directive({
  selector: '[ndChartLegendIndicator]',
  host: {
    'data-slot': 'chart-legend-indicator',
    '[style.background-color]': 'color()',
    '[class]': 'classes()',
  },
})
export class ChartLegendIndicator {
  /** The series' color. */
  readonly color = input('currentColor');

  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('h-2 w-2 shrink-0 rounded-[2px]', this.class()),
  );
}
