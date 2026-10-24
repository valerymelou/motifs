import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// The quality bar is zero axe violations against WCAG 2.2 A and AA.
const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function violations(page: Page, exclude?: string) {
  const builder = new AxeBuilder({ page }).withTags(wcagTags);
  return (await (exclude ? builder.exclude(exclude) : builder).analyze())
    .violations;
}

// Reduced motion, so axe never measures an element mid-animation.
test.use({ reducedMotion: 'reduce' });

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`in the ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no axe violations', async ({ page }) => {
      await page.goto('./');

      expect(await violations(page)).toEqual([]);
    });

    test('has no axe violations with the palette open', async ({ page }) => {
      await page.goto('./');
      await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
      await page.keyboard.press('ControlOrMeta+k');
      await expect(page.getByRole('dialog')).toBeVisible();

      // The page behind the overlay is dimmed, and was checked above with
      // the palette closed; this checks the palette itself.
      expect(await violations(page, 'mt-root')).toEqual([]);
    });
  });
}
