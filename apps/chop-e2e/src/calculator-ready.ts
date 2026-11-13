import { expect, type Page } from '@playwright/test';

/**
 * Waits until the calculator has hydrated. It sits in a `@defer (hydrate
 * on viewport)` block below the opening wheel, so until it scrolls into
 * view and its code loads, its controls are prerendered HTML that ignores
 * keys and clicks. Focusing the wheel marks the first turn once it has.
 */
export async function calculatorReady(page: Page): Promise<void> {
  const plot = page.locator('#circle [data-slot="chart-plot"]');
  await plot.scrollIntoViewIfNeeded();
  await expect(async () => {
    await plot.blur();
    await plot.focus();
    await expect(plot).toHaveAttribute('data-active', '0', { timeout: 500 });
  }).toPass();
  await plot.blur();
}
