import { expect, test } from '@playwright/test';

test('shows the page title and heading', async ({ page }) => {
  await page.goto('./');

  await expect(page).toHaveTitle('Atelier Ndop · Motifs');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Dipped green. Blue in the air.',
  );
});

test('loads every file from under its path', async ({ page }) => {
  const failed: string[] = [];
  page.on('response', (response) => {
    if (response.status() >= 400) {
      failed.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto('./', { waitUntil: 'load' });

  expect(failed).toEqual([]);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('content is readable from the prerendered HTML', async ({ page }) => {
    await page.goto('./');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Dipped green. Blue in the air.',
    );
  });
});
