import { type RoastProfile } from './catalogue';

/**
 * A roast's curve: the beans' temperature over time, drawn to one scale
 * for all three roasts so they compare. The beans go into a hot drum and
 * cool it, so the temperature falls to the turning point, then climbs,
 * more slowly as the roast goes on, to the drop.
 */

/** The chart's frame, in viewBox units, and its scales. */
export const CURVE = {
  width: 520,
  height: 260,
  left: 44,
  right: 16,
  top: 16,
  bottom: 34,
  /** Minutes. */
  maxTime: 13,
  /** Degrees Celsius. */
  minTemp: 80,
  maxTemp: 240,
} as const;

export interface CurvePoint {
  readonly x: number;
  readonly y: number;
}

export interface Curve {
  readonly path: string;
  readonly firstCrack: CurvePoint;
  readonly drop: CurvePoint;
  /** Gridlines and their labels, for the axes. */
  readonly minutes: readonly { readonly x: number; readonly label: string }[];
  readonly degrees: readonly { readonly y: number; readonly label: string }[];
}

const round = (value: number) => Math.round(value * 10) / 10;

export function x(time: number): number {
  const span = CURVE.width - CURVE.left - CURVE.right;
  return round(CURVE.left + (time / CURVE.maxTime) * span);
}

export function y(temp: number): number {
  const span = CURVE.height - CURVE.top - CURVE.bottom;
  return round(
    CURVE.top +
      (1 - (temp - CURVE.minTemp) / (CURVE.maxTemp - CURVE.minTemp)) * span,
  );
}

/**
 * The beans' temperature at a time in the roast.
 *
 * @param profile - The roast's profile.
 * @param time - Minutes since the beans went in, up to the drop.
 */
export function temperatureAt(profile: RoastProfile, time: number): number {
  const { charge, turning, drop } = profile;
  if (time <= turning.time) {
    // From the charge down to the turning point, easing out.
    const u = time / turning.time;
    return charge + (turning.temp - charge) * (1 - (1 - u) ** 2);
  }
  // From the turning point up to the drop, its rise slowing.
  const u = (time - turning.time) / (drop.time - turning.time);
  return turning.temp + (drop.temp - turning.temp) * (1 - (1 - u) ** 1.7);
}

/**
 * The curve for a roast, sampled every 15 seconds.
 *
 * @param profile - The roast's profile.
 */
export function roastCurve(profile: RoastProfile): Curve {
  const steps = Math.round(profile.drop.time * 4);
  const points = Array.from({ length: steps + 1 }, (_, i) => {
    const time = (i / steps) * profile.drop.time;
    return `${x(time)} ${y(temperatureAt(profile, time))}`;
  });
  return {
    path: `M${points.join(' L')}`,
    firstCrack: {
      x: x(profile.firstCrack),
      y: y(temperatureAt(profile, profile.firstCrack)),
    },
    drop: { x: x(profile.drop.time), y: y(profile.drop.temp) },
    minutes: [0, 3, 6, 9, 12].map((minute) => ({
      x: x(minute),
      label: `${minute} min`,
    })),
    degrees: [100, 150, 200].map((degree) => ({
      y: y(degree),
      label: `${degree} °C`,
    })),
  };
}
