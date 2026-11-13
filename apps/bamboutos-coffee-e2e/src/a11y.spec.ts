import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// The quality bar is zero axe violations against WCAG 2.2 A and AA.
const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function violations(page: Page) {
  return (await new AxeBuilder({ page }).withTags(wcagTags).analyze())
    .violations;
}

// Reduced motion, so axe never measures an element mid-animation.
test.use({ reducedMotion: 'reduce' });

test('has no axe violations', async ({ page }) => {
  await page.goto('./');

  expect(await violations(page)).toEqual([]);
});

test('has no axe violations with the route card open', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Route' }).click();
  await expect(page.getByRole('navigation', { name: 'Route' })).toBeVisible();

  expect(await violations(page)).toEqual([]);
});
