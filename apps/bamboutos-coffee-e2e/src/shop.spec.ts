import { expect, test, type Page } from '@playwright/test';

/** Adds a bag once the shop has hydrated: until then a click does nothing. */
async function addToCart(page: Page, name: RegExp) {
  const shop = page.locator('#shop');
  await shop.scrollIntoViewIfNeeded();
  const count = page.locator('header .cart-count');
  const before = Number((await count.count()) ? await count.textContent() : 0);
  await expect(async () => {
    await shop.getByRole('button', { name }).click();
    await expect(count).toHaveText(String(before + 1), { timeout: 700 });
  }).toPass();
}

test('adds a bag in a chosen size and grind, with a toast that can undo it', async ({
  page,
}) => {
  await page.goto('./');
  const shop = page.locator('#shop');
  await shop.scrollIntoViewIfNeeded();
  const card = shop.getByRole('listitem').filter({ hasText: 'Medium roast' });

  // Choosing a size needs the shop hydrated: retry until it answers.
  await expect(async () => {
    await card.getByRole('button', { name: '1 kg' }).click();
    await expect(card.getByRole('button', { name: '1 kg' })).toHaveAttribute(
      'aria-pressed',
      'true',
      { timeout: 500 },
    );
  }).toPass();
  await expect(card).toContainText('15,000 FCFA');

  await card.getByRole('combobox', { name: 'Grind' }).click();
  await page.getByRole('option', { name: 'Filter' }).click();
  await card.getByRole('button', { name: 'Add to cart: Medium roast' }).click();

  const toast = page.getByRole('region', { name: /Notifications/ });
  await expect(toast).toContainText('Added to cart');
  await expect(toast).toContainText('Medium roast, 1 kg, Filter');
  await expect(page.locator('header .cart-count')).toHaveText('1');

  await toast.getByRole('button', { name: 'Undo' }).click();
  await expect(page.locator('header .cart-count')).toHaveCount(0);
});

test('opens the cart from the header, changes a quantity, and closes with Escape', async ({
  page,
}) => {
  await page.goto('./');
  await addToCart(page, /Add to cart: Dark roast/);
  await addToCart(page, /Add to cart: Dark roast/);

  const cartLink = page.locator('header .cart');
  await cartLink.click();
  const sheet = page.getByRole('dialog', { name: 'Your cart' });
  await expect(sheet).toBeVisible();
  await expect(sheet).toContainText('Dark roast, 250 g, Whole bean');
  await expect(sheet).toContainText('9,000 FCFA');

  await sheet
    .getByRole('button', { name: 'One more: Dark roast, 250 g, Whole bean' })
    .click();
  await expect(sheet).toContainText('13,500 FCFA');

  await sheet.getByRole('button', { name: 'Checkout' }).click();
  await expect(sheet.getByRole('status')).toHaveText(
    'Bamboutos Coffee is a design study: nothing is sold or shipped.',
  );

  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
  await expect(page.locator('header .cart-count')).toHaveText('3');
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('opens the cart without its slide', async ({ page }) => {
    await page.goto('./');
    await addToCart(page, /Add to cart: Light roast/);
    await page.locator('header .cart').click();
    const sheet = page.getByRole('dialog', { name: 'Your cart' });
    await expect(sheet).toBeVisible();

    await expect(sheet).toHaveCSS('animation-name', 'none');
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('lists the three roasts with their prices', async ({ page }) => {
    await page.goto('./');
    const shop = page.locator('#shop');

    await expect(shop.getByRole('heading', { level: 3 })).toHaveText([
      'Light roast',
      'Medium roast',
      'Dark roast',
    ]);
    await expect(shop).toContainText('5,000 FCFA');
    await expect(shop).toContainText('4,500 FCFA');
  });
});
