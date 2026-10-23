import { PAGES } from '@motifs/pages-manifest';
import { contrast, motifOf, motifTile, threadOn } from './motifs';

describe('motifs', () => {
  it('gives every page its own motif', () => {
    const motifs = PAGES.map((page) => motifOf(page.slug));

    expect(new Set(motifs).size).toBe(PAGES.length);
  });

  it('draws each motif as a CSS image of an SVG tile', () => {
    const tile = motifTile('spindle', '#F4EFE4');

    expect(tile.startsWith('url("data:image/svg+xml,')).toBe(true);
    expect(decodeURIComponent(tile)).toContain('fill="#F4EFE4"');
  });

  it('threads every band in a color that stands out from its accent', () => {
    // 3:1 is WCAG's minimum for graphics that carry meaning.
    for (const page of PAGES) {
      expect(
        contrast(page.accent, threadOn(page.accent)),
      ).toBeGreaterThanOrEqual(3);
    }
  });

  it('measures contrast as WCAG does', () => {
    expect(contrast('#000000', '#FFFFFF')).toBeCloseTo(21);
    expect(contrast('#777777', '#777777')).toBeCloseTo(1);
  });

  it('refuses a page without a motif', () => {
    expect(() => motifOf('nope')).toThrow('No motif for "nope"');
  });
});
