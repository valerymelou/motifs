/** A point in SVG user units. */
export interface ChartPoint {
  /** Horizontal position. */
  readonly x: number;
  /** Vertical position. */
  readonly y: number;
}

/** How a line or area joins its points. */
export type ChartCurve = 'linear' | 'monotone' | 'step';

/** A scale from numbers to positions, as from data to pixels. */
export interface LinearScale {
  /**
   * The position of a value.
   *
   * @param value - A value in the domain.
   * @returns Its position in the range.
   */
  (value: number): number;
  /** The domain, after `nice`. */
  readonly domain: readonly [number, number];
  /**
   * Round values across the domain, for axis labels and grid lines.
   *
   * @param count - About how many; defaults to 5.
   * @returns The values.
   */
  ticks(count?: number): number[];
}

/** A scale from categories to bands, as for bars. */
export interface BandScale {
  /**
   * Where a category's band starts.
   *
   * @param key - A category in the domain.
   * @returns The band's start, or `NaN` for an unknown category.
   */
  (key: string): number;
  /** The width of each band. */
  readonly bandwidth: number;
  /** The distance from one band's start to the next one's. */
  readonly step: number;
}

/** A scale from dates to positions. */
export interface TimeScale {
  /**
   * The position of a date.
   *
   * @param value - A date in the domain.
   * @returns Its position in the range.
   */
  (value: Date): number;
  /**
   * Dates at round intervals across the domain: days, weeks, months or
   * years, whichever gives about `count`.
   *
   * @param count - About how many; defaults to 5.
   * @returns The dates.
   */
  ticks(count?: number): Date[];
}

/** One slice of a pie, donut or radial chart. */
export interface ChartArc {
  /** Where it starts, in radians clockwise from 12 o'clock. */
  readonly startAngle: number;
  /** Where it ends, in radians. */
  readonly endAngle: number;
  /** Its value. */
  readonly value: number;
  /** Its index in the values. */
  readonly index: number;
}

/** Space around a {@link BandScale}'s bands, in fractions of a step. */
export interface BandPadding {
  /** Space between bands; defaults to 0.2. */
  readonly inner?: number;
  /** Space before the first band and after the last; defaults to 0.2. */
  readonly outer?: number;
}

/** The angles a pie spans, for {@link pieArcs}. */
export interface PieOptions {
  /** Where the first slice starts, in radians clockwise from 12 o'clock. */
  readonly startAngle?: number;
  /** Where the last slice ends; defaults to a full turn after 0. */
  readonly endAngle?: number;
  /** The gap between slices, in radians; defaults to 0. */
  readonly padAngle?: number;
}

/**
 * The smallest and largest of some numbers.
 *
 * @param values - The numbers.
 * @returns `[min, max]`, or `[0, 0]` for none.
 */
export function extent(values: readonly number[]): [number, number] {
  if (values.length === 0) {
    return [0, 0];
  }
  return [Math.min(...values), Math.max(...values)];
}

/**
 * A round step for about `count` ticks between two values: 1, 2 or 5
 * times a power of ten.
 *
 * @param min - The lower value.
 * @param max - The upper value.
 * @param count - About how many ticks.
 * @returns The step.
 */
function tickStep(min: number, max: number, count: number): number {
  const raw = Math.abs(max - min) / Math.max(1, count);
  const power = 10 ** Math.floor(Math.log10(raw || 1));
  const error = raw / power;
  const factor = error >= 7.5 ? 10 : error >= 3.5 ? 5 : error >= 1.5 ? 2 : 1;
  return factor * power;
}

/**
 * Round values from `min` to `max`, about `count` of them.
 *
 * @param min - The lower value.
 * @param max - The upper value.
 * @param count - About how many; defaults to 5.
 * @returns The values, ascending.
 */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (min === max) {
    return [min];
  }
  const step = tickStep(min, max, count);
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let value = start; value <= max + step / 1e6; value += step) {
    // Rounds away floating point noise, such as 0.30000000000000004.
    ticks.push(Number(value.toPrecision(12)));
  }
  return ticks;
}

/**
 * A linear scale. With `nice`, the domain extends to round values, so the
 * axis starts and ends on a tick.
 *
 * @param domain - The values, `[min, max]`.
 * @param range - The positions, `[start, end]`; reversed works, as for a
 *   y axis that grows upward.
 * @param nice - Whether to round the domain out; defaults to `true`.
 * @returns The scale.
 *
 * @example
 * ```ts
 * const y = scaleLinear([0, 305], [200, 0]);
 * y(150); // 100
 * ```
 */
export function scaleLinear(
  domain: readonly [number, number],
  range: readonly [number, number],
  nice = true,
): LinearScale {
  let [d0, d1] = domain;
  if (nice && d0 !== d1) {
    const step = tickStep(d0, d1, 5);
    d0 = Math.floor(d0 / step) * step;
    d1 = Math.ceil(d1 / step) * step;
  }
  const [r0, r1] = range;
  const span = d1 - d0 || 1;
  const scale = ((value: number) =>
    r0 + ((value - d0) / span) * (r1 - r0)) as LinearScale;
  Object.assign(scale, {
    domain: [d0, d1] as const,
    ticks: (count = 5) => niceTicks(d0, d1, count),
  });
  return scale;
}

/**
 * A band scale: the range split into one band per category, with padding
 * between bands and at the ends, in fractions of a step.
 *
 * @param domain - The categories, in order.
 * @param range - The positions, `[start, end]`.
 * @param padding - Space between bands and at the ends.
 * @returns The scale.
 *
 * @example
 * ```ts
 * const x = scaleBand(['Jan', 'Feb'], [0, 400]);
 * x('Feb'); // where February's bar starts
 * x.bandwidth; // the bar's width
 * ```
 */
export function scaleBand(
  domain: readonly string[],
  range: readonly [number, number],
  padding: BandPadding = {},
): BandScale {
  const inner = padding.inner ?? 0.2;
  const outer = padding.outer ?? 0.2;
  const [r0, r1] = range;
  const step = (r1 - r0) / Math.max(1, domain.length - inner + outer * 2);
  const index = new Map(domain.map((key, i) => [key, i]));
  const scale = ((key: string) => {
    const i = index.get(key);
    return i === undefined ? Number.NaN : r0 + step * (outer + i);
  }) as BandScale;
  Object.assign(scale, { bandwidth: step * (1 - inner), step });
  return scale;
}

/** Time intervals for ticks, shortest first. */
const INTERVALS = [
  { days: 1, months: 0 },
  { days: 7, months: 0 },
  { days: 0, months: 1 },
  { days: 0, months: 3 },
  { days: 0, months: 12 },
] as const;

/**
 * A time scale: linear on timestamps, with ticks on round days, weeks,
 * months or years.
 *
 * @param domain - The dates, `[first, last]`.
 * @param range - The positions, `[start, end]`.
 * @returns The scale.
 *
 * @example
 * ```ts
 * const x = scaleTime([new Date(2026, 0, 1), new Date(2026, 5, 30)], [0, 600]);
 * x.ticks(6); // the 1st of each month
 * ```
 */
export function scaleTime(
  domain: readonly [Date, Date],
  range: readonly [number, number],
): TimeScale {
  const [d0, d1] = domain.map((date) => date.getTime()) as [number, number];
  const linear = scaleLinear([d0, d1], range, false);
  const scale = ((value: Date) => linear(value.getTime())) as TimeScale;
  Object.assign(scale, {
    ticks(count = 5) {
      const days = (d1 - d0) / 86_400_000;
      const interval =
        INTERVALS.find(
          (option) => days / (option.days || option.months * 30.4) <= count,
        ) ?? INTERVALS[4];
      const first = new Date(d0);
      let date =
        interval.months > 0
          ? new Date(first.getFullYear(), first.getMonth(), 1)
          : new Date(first.getFullYear(), first.getMonth(), first.getDate());
      const ticks: Date[] = [];
      while (date.getTime() <= d1) {
        if (date.getTime() >= d0) {
          ticks.push(date);
        }
        date =
          interval.months > 0
            ? new Date(date.getFullYear(), date.getMonth() + interval.months, 1)
            : new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + interval.days,
              );
      }
      return ticks;
    },
  });
  return scale;
}

/**
 * Formats a number for an SVG path, short and without noise.
 *
 * @param value - The number.
 * @returns Its text.
 */
function n(value: number): string {
  return String(Math.round(value * 100) / 100);
}

/**
 * The slopes of a monotone cubic through points, which never overshoot
 * them (Fritsch–Carlson).
 *
 * @param points - The points, by ascending x.
 * @returns One tangent per point.
 */
function monotoneTangents(points: readonly ChartPoint[]): number[] {
  const count = points.length;
  const slopes: number[] = [];
  for (let i = 0; i < count - 1; i++) {
    const a = points[i] as ChartPoint;
    const b = points[i + 1] as ChartPoint;
    slopes.push((b.y - a.y) / (b.x - a.x || 1));
  }
  const tangents = points.map((_, i) => {
    if (i === 0) return slopes[0] ?? 0;
    if (i === count - 1) return slopes[count - 2] ?? 0;
    const before = slopes[i - 1] as number;
    const after = slopes[i] as number;
    return before * after <= 0 ? 0 : (before + after) / 2;
  });
  for (let i = 0; i < count - 1; i++) {
    const slope = slopes[i] as number;
    if (slope === 0) {
      tangents[i] = 0;
      tangents[i + 1] = 0;
      continue;
    }
    const alpha = (tangents[i] as number) / slope;
    const beta = (tangents[i + 1] as number) / slope;
    const length = alpha * alpha + beta * beta;
    if (length > 9) {
      const tau = 3 / Math.sqrt(length);
      tangents[i] = tau * alpha * slope;
      tangents[i + 1] = tau * beta * slope;
    }
  }
  return tangents;
}

/**
 * The path segments through points, after a first `M`.
 *
 * @param points - The points, by ascending x.
 * @param curve - How to join them.
 * @returns The segments, as SVG path commands.
 */
function segments(points: readonly ChartPoint[], curve: ChartCurve): string {
  let path = '';
  if (curve === 'monotone' && points.length > 2) {
    const tangents = monotoneTangents(points);
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i] as ChartPoint;
      const b = points[i + 1] as ChartPoint;
      const dx = (b.x - a.x) / 3;
      path += `C${n(a.x + dx)},${n(a.y + dx * (tangents[i] as number))},${n(b.x - dx)},${n(b.y - dx * (tangents[i + 1] as number))},${n(b.x)},${n(b.y)}`;
    }
    return path;
  }
  for (let i = 1; i < points.length; i++) {
    const point = points[i] as ChartPoint;
    if (curve === 'step') {
      const previous = points[i - 1] as ChartPoint;
      const middle = (previous.x + point.x) / 2;
      path += `H${n(middle)}V${n(point.y)}H${n(point.x)}`;
    } else {
      path += `L${n(point.x)},${n(point.y)}`;
    }
  }
  return path;
}

/**
 * An SVG path through points, for a line chart.
 *
 * @param points - The points, by ascending x.
 * @param curve - How to join them; defaults to `linear`.
 * @returns The path's `d`, or an empty string for no points.
 *
 * @example
 * ```html
 * <path [attr.d]="linePath(points(), 'monotone')" />
 * ```
 */
export function linePath(
  points: readonly ChartPoint[],
  curve: ChartCurve = 'linear',
): string {
  const [first] = points;
  return first ? `M${n(first.x)},${n(first.y)}${segments(points, curve)}` : '';
}

/**
 * An SVG path filling between a line through points and a baseline, for
 * an area chart. With `lower` points, as for a stacked series, it fills
 * between the two lines.
 *
 * @param points - The top points, by ascending x.
 * @param baseline - The bottom's y, or the bottom points.
 * @param curve - How to join them; defaults to `linear`.
 * @returns The path's `d`, or an empty string for no points.
 */
export function areaPath(
  points: readonly ChartPoint[],
  baseline: number | readonly ChartPoint[],
  curve: ChartCurve = 'linear',
): string {
  const [first] = points;
  const last = points[points.length - 1];
  if (!first || !last) {
    return '';
  }
  const top = `M${n(first.x)},${n(first.y)}${segments(points, curve)}`;
  if (typeof baseline === 'number') {
    return `${top}L${n(last.x)},${n(baseline)}L${n(first.x)},${n(baseline)}Z`;
  }
  const lower = [...baseline].reverse();
  const start = lower[0] as ChartPoint;
  return `${top}L${n(start.x)},${n(start.y)}${segments(lower, curve)}Z`;
}

/**
 * An SVG path for a slice of a ring, centered on 0,0: a pie slice when
 * `innerRadius` is 0, a donut segment or a radial bar otherwise.
 *
 * @param arc - The slice's angles, in radians clockwise from 12 o'clock.
 * @param innerRadius - The hole's radius; 0 for a pie.
 * @param outerRadius - The slice's radius.
 * @returns The path's `d`.
 *
 * @example
 * ```html
 * <path [attr.d]="arcPath(slice, 60, 100)" transform="translate(120 120)" />
 * ```
 */
export function arcPath(
  arc: Pick<ChartArc, 'startAngle' | 'endAngle'>,
  innerRadius: number,
  outerRadius: number,
): string {
  // A full circle as one arc has equal ends, which SVG draws as nothing.
  const end = Math.min(arc.endAngle, arc.startAngle + Math.PI * 2 - 1e-6);
  const point = (radius: number, angle: number) =>
    `${n(radius * Math.sin(angle))},${n(-radius * Math.cos(angle))}`;
  const large = end - arc.startAngle > Math.PI ? 1 : 0;
  const outer = `M${point(outerRadius, arc.startAngle)}A${n(outerRadius)},${n(outerRadius)},0,${large},1,${point(outerRadius, end)}`;
  if (innerRadius <= 0) {
    return `${outer}L0,0Z`;
  }
  return `${outer}L${point(innerRadius, end)}A${n(innerRadius)},${n(innerRadius)},0,${large},0,${point(innerRadius, arc.startAngle)}Z`;
}

/**
 * The angles of a pie's slices, in order, each proportional to its value.
 *
 * @param values - The values; negatives count as 0.
 * @param options - The angles to span and the gap between slices.
 * @returns One arc per value.
 */
export function pieArcs(
  values: readonly number[],
  options: PieOptions = {},
): ChartArc[] {
  const start = options.startAngle ?? 0;
  const span = (options.endAngle ?? Math.PI * 2) - start;
  const pad = options.padAngle ?? 0;
  const total = values.reduce((sum, value) => sum + Math.max(0, value), 0);
  let angle = start;
  return values.map((value, index) => {
    const share = total > 0 ? (Math.max(0, value) / total) * span : 0;
    const arc = {
      startAngle: angle + pad / 2,
      endAngle: Math.max(angle + pad / 2, angle + share - pad / 2),
      value,
      index,
    };
    angle += share;
    return arc;
  });
}

/**
 * Stacks series on top of each other, as for stacked bars or areas.
 *
 * @param series - Each series' values, in the same order.
 * @returns For each series, each value's `[bottom, top]`.
 *
 * @example
 * ```ts
 * stack([[1, 2], [3, 4]]); // [[[0, 1], [0, 2]], [[1, 4], [2, 6]]]
 * ```
 */
export function stack(
  series: readonly (readonly number[])[],
): [number, number][][] {
  const totals: number[] = [];
  return series.map((values) =>
    values.map((value, index) => {
      const bottom = totals[index] ?? 0;
      totals[index] = bottom + value;
      return [bottom, bottom + value];
    }),
  );
}
