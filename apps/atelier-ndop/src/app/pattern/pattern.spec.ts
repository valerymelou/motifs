import { MOTIFS } from './motifs';
import {
  DEFAULT_PATTERN,
  DENSITY,
  DEPTHS,
  describe as describeCloth,
  layoutCloth,
} from './pattern';

// WCAG contrast between two #rrggbb colors.
function contrast(a: string, b: string): number {
  const luminance = (hex: string) => {
    const [r = 0, g = 0, b = 0] = [1, 3, 5].map((start) => {
      const value = parseInt(hex.slice(start, start + 2), 16) / 255;
      return value <= 0.04045
        ? value / 12.92
        : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [light = 0, dark = 0] = [luminance(a), luminance(b)].sort(
    (x, y) => y - x,
  );
  return (light + 0.05) / (dark + 0.05);
}

describe('motifs', () => {
  it('gives every motif a meaning and a source', () => {
    for (const motif of MOTIFS) {
      expect(motif.meaning, motif.kind).not.toBe('');
      expect(motif.source, motif.kind).not.toBe('');
    }
  });
});

describe('layoutCloth', () => {
  it('places one motif per row and column', () => {
    const layout = layoutCloth({ ...DEFAULT_PATTERN, density: 6 });

    expect(layout.placements).toHaveLength(4 * 6);
    expect(
      layout.placements.slice(0, 6).every((p) => p.kind === 'lozenge'),
    ).toBe(true);
  });

  it('marks the seams of 120 px strips across the cloth', () => {
    expect(layoutCloth(DEFAULT_PATTERN).seams).toEqual([
      120, 240, 360, 480, 600, 720, 840,
    ]);
  });

  it('lays out the same cloth every time, on the server and in the browser', () => {
    expect(layoutCloth(DEFAULT_PATTERN)).toEqual(layoutCloth(DEFAULT_PATTERN));
  });

  it('keeps motifs apart at the highest density', () => {
    const layout = layoutCloth({ ...DEFAULT_PATTERN, density: DENSITY.max });
    const scale = Number(
      /scale\(([\d.]+)\)/.exec(layout.placements[0]?.transform ?? '')?.[1],
    );

    expect(48 * scale).toBeLessThan(layout.width / DENSITY.max);
  });
});

describe('describe', () => {
  it('reads the dyed cloth in words', () => {
    expect(describeCloth(DEFAULT_PATTERN)).toBe(
      'Four rows: crocodile lozenges, moons, diamonds, stars. 8 motifs per row. Deep indigo, six dips.',
    );
  });

  it('says when the cloth is only stitched', () => {
    expect(describeCloth({ ...DEFAULT_PATTERN, dyed: false })).toContain(
      'Stitched, not yet dyed.',
    );
  });
});

describe('DEPTHS', () => {
  it('keeps raw-cotton motifs readable on every depth of indigo', () => {
    // 3:1 is WCAG's minimum for graphics that carry meaning.
    for (const depth of DEPTHS) {
      expect(
        contrast(depth.color, '#F3EEE2'),
        depth.depth,
      ).toBeGreaterThanOrEqual(3);
    }
  });
});
