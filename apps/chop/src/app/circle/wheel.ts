/**
 * The calculator's wheel: one wedge per turn, clockwise from the top in
 * month order. Each wedge runs out from the hole by what that member has
 * paid in by their turn, against the pot at the rim, so the first wedge is
 * one payment long and the last reaches the rim.
 */
import { type Turn } from './circle';

/** The wheel's size in viewBox units: a 400 by 400 square. */
export const WHEEL = {
  size: 400,
  center: 200,
  /** The hole in the middle, where the pot and the last turn are written. */
  hole: 96,
  /** The rim: the pot. */
  rim: 184,
} as const;

/** One wedge, ready to draw. */
export interface Wedge {
  /** The SVG path. */
  readonly d: string;
  /** Where its tooltip points: the middle of its outer edge, in viewBox units. */
  readonly tip: { readonly x: number; readonly y: number };
  /** Where its month's label sits, just outside the rim. */
  readonly label: { readonly x: number; readonly y: number };
}

/** A point on the wheel, at a radius and an angle clockwise from the top. */
function point(radius: number, angle: number): [number, number] {
  return [
    WHEEL.center + radius * Math.sin(angle),
    WHEEL.center - radius * Math.cos(angle),
  ];
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * The wedges for a circle's turns.
 *
 * @param turns - The circle's turns, in month order.
 * @returns One wedge per turn, in the same order.
 */
export function wedges(turns: readonly Turn[]): readonly Wedge[] {
  const count = turns.length;
  const step = (2 * Math.PI) / count;
  // A little air between wedges, less as they get thinner.
  const gap = Math.min(0.035, step * 0.12);
  return turns.map((turn, i) => {
    const share = turn.takes > 0 ? turn.paidIn / turn.takes : 0;
    const outer = WHEEL.hole + (WHEEL.rim - WHEEL.hole) * share;
    const from = i * step + gap;
    const to = (i + 1) * step - gap;
    const large = to - from > Math.PI ? 1 : 0;
    const [ax, ay] = point(outer, from);
    const [bx, by] = point(outer, to);
    const [cx, cy] = point(WHEEL.hole, to);
    const [dx, dy] = point(WHEEL.hole, from);
    const d = [
      `M${round(ax)} ${round(ay)}`,
      `A${round(outer)} ${round(outer)} 0 ${large} 1 ${round(bx)} ${round(by)}`,
      `L${round(cx)} ${round(cy)}`,
      `A${WHEEL.hole} ${WHEEL.hole} 0 ${large} 0 ${round(dx)} ${round(dy)}`,
      'Z',
    ].join(' ');
    const middle = (from + to) / 2;
    const [tx, ty] = point(outer, middle);
    const [lx, ly] = point(WHEEL.rim + 16, middle);
    return {
      d,
      tip: { x: round(tx), y: round(ty) },
      label: { x: round(lx), y: round(ly) },
    };
  });
}
