import { expect, test } from '@playwright/test';

test('shows the page title and heading', async ({ page }) => {
  await page.goto('./');

  await expect(page).toHaveTitle('Fil · Motifs');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'One thread, every network.',
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
      'One thread, every network.',
    );
    await expect(
      page.locator('#code [role="tabpanel"]:visible').first(),
    ).toContainText('curl https://api.fil.example');
    // The palette needs JavaScript; the section links still navigate.
    await expect(page.getByRole('button', { name: 'Search' })).toBeHidden();
  });
});
