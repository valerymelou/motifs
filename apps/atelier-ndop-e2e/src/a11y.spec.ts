import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// The quality bar is zero axe violations against WCAG 2.2 A and AA.
const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const violations = async (page: Page) =>
  (await new AxeBuilder({ page }).withTags(wcagTags).analyze()).violations;

// Reduced motion settles every transition, so axe reads final colors.
test.use({ contextOptions: { reducedMotion: 'reduce' } });

test('has no axe violations', async ({ page }) => {
  await page.goto('./');

  expect(await violations(page)).toEqual([]);
});

test('no violations with the cloth stitched', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('switch', { name: 'Dye the cloth' }).click();

  expect(await violations(page)).toEqual([]);
});

test('no violations with the depth picker open', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: /Deep indigo, six dips/ }).click();
  await expect(
    page.getByRole('dialog', { name: 'Depth of indigo' }),
  ).toBeVisible();

  expect(await violations(page)).toEqual([]);
});

test('no violations with the order dialog open', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Order as a scarf' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Your cloth, as a scarf' }),
  ).toBeVisible();

  expect(await violations(page)).toEqual([]);
});
