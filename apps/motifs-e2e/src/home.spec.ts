import { expect, test, type Page } from '@playwright/test';

const cards = (page: Page) =>
  page
    .getByRole('list')
    .filter({ has: page.getByRole('article') })
    .getByRole('listitem');

test('introduces the series and lists all twelve pages', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Motifs');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Motifs');
  await expect(cards(page)).toHaveCount(12);
  await expect(page.getByText('Coming soon')).toHaveCount(12);
  await expect(page.getByRole('contentinfo')).toContainText(
    'implemented with AI coding tools',
  );
});

test('filters the pages by mood', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Editorial' }).click();

  await expect(cards(page)).toHaveCount(4);
  await expect(cards(page).first()).toContainText('Fil');
});

test('filters with the keyboard', async ({ page }) => {
  await page.goto('/');
  const filter = page.getByRole('group', { name: 'Filter by mood' });

  await filter.getByRole('button', { name: 'Immersive' }).focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Space');

  await expect(filter.getByRole('button', { name: 'Playful' })).toBeFocused();
  await expect(cards(page)).toHaveCount(4);
  await expect(cards(page).first()).toContainText('Njangi');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('lists every page from the prerendered HTML', async ({ page }) => {
    await page.goto('/');

    await expect(cards(page)).toHaveCount(12);
  });
});
