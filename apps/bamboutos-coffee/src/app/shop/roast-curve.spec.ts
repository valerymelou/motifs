import { ROASTS } from './catalogue';
import { CURVE, roastCurve, temperatureAt, x, y } from './roast-curve';

describe('roastCurve', () => {
  const [light, medium, dark] = ROASTS.map((roast) => roast.profile);

  it('starts at the charge, falls to the turning point, ends at the drop', () => {
    for (const profile of [light, medium, dark]) {
      if (!profile) continue;
      expect(temperatureAt(profile, 0)).toBe(profile.charge);
      expect(temperatureAt(profile, profile.turning.time)).toBeCloseTo(
        profile.turning.temp,
      );
      expect(temperatureAt(profile, profile.drop.time)).toBeCloseTo(
        profile.drop.temp,
      );
    }
  });

  it('only climbs after the turning point', () => {
    if (!medium) return;
    let last = medium.turning.temp;
    for (let t = medium.turning.time; t <= medium.drop.time; t += 0.25) {
      const temp = temperatureAt(medium, t);
      expect(temp).toBeGreaterThanOrEqual(last);
      last = temp;
    }
  });

  it('draws every roast to the same scale, inside the frame', () => {
    const drops = ROASTS.map((roast) => roastCurve(roast.profile).drop);

    // Darker roasts drop later and hotter: further right, higher up.
    expect(drops.map((point) => point.x)).toEqual(
      [...drops.map((point) => point.x)].sort((a, b) => a - b),
    );
    expect(drops.map((point) => point.y)).toEqual(
      [...drops.map((point) => point.y)].sort((a, b) => b - a),
    );
    for (const point of drops) {
      expect(point.x).toBeLessThanOrEqual(CURVE.width - CURVE.right);
      expect(point.y).toBeGreaterThanOrEqual(CURVE.top);
    }
  });

  it('puts first crack on the curve', () => {
    if (!medium) return;
    const curve = roastCurve(medium);

    expect(curve.firstCrack.x).toBe(x(medium.firstCrack));
    expect(curve.firstCrack.y).toBe(
      y(temperatureAt(medium, medium.firstCrack)),
    );
  });

  it('labels the axes with values the chart reaches', () => {
    if (!dark) return;
    const curve = roastCurve(dark);

    expect(curve.minutes.map((tick) => tick.label)).toEqual([
      '0 min',
      '3 min',
      '6 min',
      '9 min',
      '12 min',
    ]);
    expect(curve.degrees.map((tick) => tick.label)).toEqual([
      '100 °C',
      '150 °C',
      '200 °C',
    ]);
  });
});
