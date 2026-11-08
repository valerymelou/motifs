import { turns } from './circle';
import { WHEEL, wedges } from './wheel';

/** How far a point is from the wheel's centre. */
function radius({ x, y }: { x: number; y: number }): number {
  return Math.hypot(x - WHEEL.center, y - WHEEL.center);
}

describe('wedges', () => {
  it('draws one wedge per turn', () => {
    expect(
      wedges(turns({ members: 3, contribution: 5_000, start: 0 })),
    ).toHaveLength(3);
    expect(
      wedges(turns({ members: 20, contribution: 100_000, start: 11 })),
    ).toHaveLength(20);
  });

  it('runs the first wedge one payment out and the last to the rim', () => {
    const drawn = wedges(
      turns({ members: 10, contribution: 25_000, start: 0 }),
    );
    const span = WHEEL.rim - WHEEL.hole;

    expect(radius(drawn[0]?.tip ?? { x: 0, y: 0 })).toBeCloseTo(
      WHEEL.hole + span / 10,
      1,
    );
    expect(radius(drawn[9]?.tip ?? { x: 0, y: 0 })).toBeCloseTo(WHEEL.rim, 1);
  });

  it('starts at the top and goes clockwise', () => {
    const [first, second] = wedges(
      turns({ members: 4, contribution: 10_000, start: 0 }),
    );

    // The first wedge's middle is up and to the right; the second's down and to the right.
    expect(first?.tip.x).toBeGreaterThan(WHEEL.center);
    expect(first?.tip.y).toBeLessThan(WHEEL.center);
    expect(second?.tip.x).toBeGreaterThan(WHEEL.center);
    expect(second?.tip.y).toBeGreaterThan(WHEEL.center);
  });

  it('leaves the same gap whatever the contribution', () => {
    const small = wedges(turns({ members: 6, contribution: 5_000, start: 0 }));
    const large = wedges(
      turns({ members: 6, contribution: 100_000, start: 0 }),
    );

    expect(small.map((wedge) => wedge.d)).toEqual(
      large.map((wedge) => wedge.d),
    );
  });
});
