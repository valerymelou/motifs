import { PAGES } from '@motifs/pages-manifest';
import { contrast } from './motifs/motifs';
import { specimenOf } from './specimens';

describe('specimens', () => {
  it('gives every page a card', () => {
    for (const page of PAGES) {
      expect(specimenOf(page.slug).title).not.toBe('');
    }
  });

  it("keeps every card's text and button at 4.5:1 or more", () => {
    for (const page of PAGES) {
      const { theme } = specimenOf(page.slug);

      expect(
        contrast(theme.foreground, theme.background),
        page.slug,
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrast(theme.primaryForeground, theme.primary),
        page.slug,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });
});
