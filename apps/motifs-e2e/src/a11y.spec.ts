import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// The quality bar is zero axe violations against WCAG 2.2 A and AA.
const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const check = async (page: Page) =>
  (await new AxeBuilder({ page }).withTags(wcagTags).analyze()).violations;

// Reduced motion keeps every section settled, so axe sees final colors
// rather than elements mid-reveal.
test.use({ contextOptions: { reducedMotion: 'reduce' } });

test('the index has no axe violations', async ({ page }) => {
  await page.goto('/');

  expect(await check(page)).toEqual([]);
});

test('no violations with any page card in the specimen', async ({ page }) => {
  await page.goto('/');
  const picker = page.getByRole('group', { name: "Show a page's card" });

  for (const button of await picker.getByRole('button').all()) {
    await button.click();
    expect(
      await check(page),
      (await button.getAttribute('aria-label')) ?? '',
    ).toEqual([]);
  }
});

test('no violations with a mood picked', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Playful/ }).click();

  expect(await check(page)).toEqual([]);
});
