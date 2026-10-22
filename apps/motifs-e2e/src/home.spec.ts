import { expect, test } from '@playwright/test';

test('shows the series title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Motifs');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Motifs');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('content is readable from the prerendered HTML', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Motifs');
  });
});
