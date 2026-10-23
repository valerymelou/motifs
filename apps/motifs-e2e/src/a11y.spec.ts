import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// The quality bar is zero axe violations against WCAG 2.2 A and AA.
const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

test('the index has no axe violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();

  expect(results.violations).toEqual([]);
});

test('the index has no axe violations with a mood picked', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Playful' }).click();

  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();

  expect(results.violations).toEqual([]);
});
