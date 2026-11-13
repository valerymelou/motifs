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

test('has no axe violations with the cart open', async ({ page }) => {
  await page.goto('./');
  const shop = page.locator('#shop');
  await shop.scrollIntoViewIfNeeded();
  await expect(async () => {
    await shop
      .getByRole('button', { name: 'Add to cart: Light roast' })
      .click();
    await expect(page.locator('header .cart-count')).toHaveText('1', {
      timeout: 700,
    });
  }).toPass();
  await page.locator('header .cart').click();
  await expect(page.getByRole('dialog', { name: 'Your cart' })).toBeVisible();

  expect(await violations(page)).toEqual([]);
});

test('has no axe violations with a grind list open', async ({ page }) => {
  await page.goto('./');
  const shop = page.locator('#shop');
  await shop.scrollIntoViewIfNeeded();
  const grind = shop.getByRole('combobox', { name: 'Grind' }).first();
  await expect(async () => {
    await grind.click();
    await expect(page.getByRole('listbox')).toBeVisible({ timeout: 700 });
  }).toPass();

  expect(await violations(page)).toEqual([]);
});
