import { expect, test } from '@playwright/test';

test('shows the page title and heading', async ({ page }) => {
  await page.goto('./');

  await expect(page).toHaveTitle('Chop · Motifs');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Ten friends. One pot. Every turn comes.',
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

  test('shows the example circle as its table', async ({ page }) => {
    await page.goto('./');

    const table = page.getByRole('table', { name: 'Each turn of the circle' });
    await expect(table).toBeVisible();
    await expect(table.getByRole('row')).toHaveCount(11);
    await expect(table).toContainText('October 2027');
    // The toggle needs JavaScript, and so does reading the chart by key.
    await expect(
      page.getByRole('button', { name: 'Show as a table' }),
    ).toBeHidden();
  });
});
