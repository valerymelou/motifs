import { expect, test } from '@playwright/test';

test('switches roasts by keyboard and shows each one’s notes and curve', async ({
  page,
}) => {
  await page.goto('./');
  const roasts = page.locator('#roasts');
  await roasts.scrollIntoViewIfNeeded();
  const medium = roasts.getByRole('tab', { name: 'Medium' });
  const dark = roasts.getByRole('tab', { name: 'Dark' });

  await expect(medium).toHaveAttribute('aria-selected', 'true');
  await expect(roasts.getByRole('tabpanel')).toContainText('Cocoa');

  // Hydrated once the arrow key moves the selection.
  await expect(async () => {
    await medium.focus();
    await page.keyboard.press('ArrowRight');
    await expect(dark).toHaveAttribute('aria-selected', 'true', {
      timeout: 500,
    });
  }).toPass();

  const panel = roasts.getByRole('tabpanel');
  await expect(panel).toContainText('Molasses');
  await expect(panel).toContainText('out of the drum at 12:15 and 226 °C');
});

test('opens a recipe in the brew guide', async ({ page }) => {
  await page.goto('./');
  const brew = page.locator('#brew');
  await brew.scrollIntoViewIfNeeded();
  const press = brew.getByRole('button', { name: /French press/ });

  await expect(async () => {
    await press.click();
    await expect(press).toHaveAttribute('aria-expanded', 'true', {
      timeout: 500,
    });
  }).toPass();
  await expect(brew).toContainText('Press the plunger down slowly');
});
