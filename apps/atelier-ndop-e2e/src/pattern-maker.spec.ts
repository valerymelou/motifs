import { expect, test, type Page } from '@playwright/test';

const section = (page: Page) => page.locator('#pattern-maker');
const caption = (page: Page) => section(page).locator('figcaption');

test('picks motifs with the keyboard and describes the cloth', async ({
  page,
}) => {
  await page.goto('./');
  const row = page.getByRole('group', { name: 'Row 2' });

  await row.getByRole('button', { name: 'Moon' }).focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Space');

  await expect(row.getByRole('button', { name: 'Star' })).toBeFocused();
  await expect(row.getByRole('button', { name: 'Star' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(caption(page)).toContainText(
    'crocodile lozenges, stars, diamonds, stars',
  );
});

test("names each row's motif and what it means", async ({ page }) => {
  await page.goto('./');

  await expect(section(page)).toContainText(
    'Row 1 · Crocodile lozenge · Royal power and fecundity',
  );
});

test('shows what a motif means on focus', async ({ page, isMobile }) => {
  test.skip(
    isMobile,
    'Tooltips open on hover and keyboard focus, not on touch.',
  );
  await page.goto('./');

  const button = page
    .getByRole('group', { name: 'Row 1' })
    .getByRole('button', { name: 'Crocodile lozenge' });

  // Event replay covers clicks, not focus, so a focus that lands before the
  // page hydrates opens nothing. Refocus until it has hydrated.
  await expect(async () => {
    await button.blur();
    await button.focus();
    await expect(page.getByRole('tooltip')).toContainText(
      'Royal power and fecundity',
      { timeout: 500 },
    );
  }).toPass();
});

test('sets the density and the depth of indigo', async ({ page }) => {
  await page.goto('./');

  await page.getByRole('slider', { name: 'Motifs per row' }).focus();
  await page.keyboard.press('ArrowRight');
  await page.getByRole('button', { name: /Deep indigo, six dips/ }).click();
  await page.getByRole('button', { name: /Night indigo/ }).click();

  await expect(caption(page)).toContainText('9 motifs per row');
  await expect(caption(page)).toContainText('Night indigo, ten dips');
});

test('dyes the cloth from stitched cotton', async ({ page }) => {
  await page.goto('./');
  const dye = page.getByRole('switch', { name: 'Dye the cloth' });

  await dye.click();
  await expect(caption(page)).toContainText('Stitched, not yet dyed.');
  await dye.click();

  await expect(caption(page)).toContainText('Deep indigo, six dips.');
  await expect(section(page).locator('.dyed')).toHaveCSS('opacity', '1');
});

test('orders the cloth as a scarf by email', async ({ page }) => {
  await page.goto('./');
  const order = page.getByRole('button', { name: 'Order as a scarf' });

  await order.click();
  const dialog = page.getByRole('dialog', { name: 'Your cloth, as a scarf' });
  const link = dialog.getByRole('link', { name: 'Email the atelier' });

  await expect(link).toHaveAttribute('href', /^mailto:/);
  expect(decodeURIComponent((await link.getAttribute('href')) ?? '')).toContain(
    'Pattern: lozenge,moon,diamond,star/8/deep',
  );
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(order).toBeFocused();
});

test.describe('with reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('the cloth changes at once, without a crossfade', async ({ page }) => {
    await page.goto('./');

    await expect(section(page).locator('.dyed')).toHaveCSS(
      'transition-duration',
      '0s',
    );
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('shows the default cloth and its description', async ({ page }) => {
    await page.goto('./');

    await expect(
      section(page).getByRole('img', { name: 'Your cloth' }),
    ).toBeVisible();
    await expect(caption(page)).toContainText('Deep indigo, six dips.');
  });
});
