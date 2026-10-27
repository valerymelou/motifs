import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
  // Hydrated once the toggle answers.
  await expect(page.getByRole('slider', { name: 'Members' })).toBeVisible();
});

test('sets the circle by keyboard and announces it once it settles', async ({
  page,
}) => {
  const members = page.getByRole('slider', { name: 'Members' });
  const contribution = page.getByRole('slider', {
    name: 'Each pays a month',
  });

  await members.focus();
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect(members).toHaveAttribute('aria-valuenow', '8');

  await contribution.focus();
  await page.keyboard.press('ArrowRight');
  await expect(contribution).toHaveAttribute(
    'aria-valuetext',
    '30,000\u00a0FCFA',
  );

  const trigger = page.getByRole('combobox', { name: 'First turn' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await page.getByRole('option', { name: 'June 2027' }).click();
  await expect(trigger).toHaveText('June 2027');

  await expect(page.locator('#calculator p[aria-live]').last()).toHaveText(
    '8 members at 30,000 FCFA: each takes 240,000 FCFA once; the last turn is January 2028.',
  );
  await expect(page.locator('rect.bar')).toHaveCount(8);
});

test('reads each turn with the chart’s arrow keys', async ({ page }) => {
  await page.locator('#calculator [data-slot="chart-plot"]').focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');

  await expect(page.locator('#calculator .chart p[aria-live]')).toHaveText(
    'March 2027, Ebai’s turn: paid in 75,000 FCFA, takes 250,000 FCFA.',
  );
  await expect(page.locator('rect.bar.is-turn')).toHaveCount(1);
  await expect(page.locator('rect.bar').nth(2)).toHaveClass(/is-turn/);
});

test('swaps the chart for the table and back', async ({ page }) => {
  const toggle = page.getByRole('button', { name: 'Show as a table' });
  const table = page.getByRole('table', { name: 'Each turn of the circle' });

  await expect(table).not.toBeInViewport();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(table).toBeVisible();
  await expect(page.locator('#calculator .chart')).toBeHidden();

  await toggle.click();
  await expect(page.locator('#calculator .chart')).toBeVisible();
});
