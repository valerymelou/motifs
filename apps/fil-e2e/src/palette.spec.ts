import { expect, test, type Page } from '@playwright/test';

const palette = (page: Page) => page.getByRole('dialog');
const shortcut = 'ControlOrMeta+k';

async function ready(page: Page) {
  await page.goto('./');
  // The palette's button shows once the page has hydrated.
  await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
}

/** Opens the palette by its shortcut and waits until it takes typing. */
async function openPalette(page: Page) {
  await page.keyboard.press(shortcut);
  await expect(page.getByRole('combobox')).toBeFocused();
}

/**
 * Types a search and runs the command it highlights. The highlight follows
 * the filter on the next render, so wait for it before pressing Enter:
 * Playwright types faster than any person.
 */
async function run(page: Page, search: string, command: string | RegExp) {
  await page.keyboard.type(search);
  await expect(
    page.getByRole('option', { name: command, selected: true }),
  ).toBeVisible();
  await page.keyboard.press('Enter');
}

test('opens with the shortcut and closes with Escape, giving focus back', async ({
  page,
}) => {
  await ready(page);
  const button = page.getByRole('button', { name: 'Search' });
  await button.focus();

  await page.keyboard.press(shortcut);
  await expect(palette(page)).toBeVisible();
  await expect(page.getByRole('combobox')).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(palette(page)).toBeHidden();
  await expect(button).toBeFocused();
});

test('opens from its button, for mouse and touch', async ({ page }) => {
  await ready(page);

  await page.getByRole('button', { name: 'Search' }).click();

  await expect(palette(page)).toBeVisible();
});

test('filters as you type, and says when nothing matches', async ({ page }) => {
  await ready(page);
  await openPalette(page);

  await page.keyboard.type('theme');
  await expect(page.getByRole('option')).toHaveCount(3);

  await page.keyboard.type('zzz');
  await expect(palette(page)).toContainText('No command matches.');
});

test('shows every sample in the chosen language, and remembers it', async ({
  page,
}) => {
  await ready(page);
  await openPalette(page);
  await run(page, 'python', 'Show samples in Python');

  const active = page.locator('#code [role="tab"][data-state="active"]');
  await expect(active).toHaveText(['Python', 'Python', 'Python']);
  await expect(active.first()).toBeFocused();
  await expect(page.getByText('Samples now in Python.')).toBeAttached();

  await page.reload();
  await expect(active).toHaveText(['Python', 'Python', 'Python']);
});

test('switches to the dark theme and keeps it on the next visit', async ({
  page,
}) => {
  await ready(page);
  await openPalette(page);
  await run(page, 'dark', 'Use the dark theme');

  await expect(page.locator('html')).toHaveClass(/\bdark\b/);

  await page.reload();
  await expect(page.locator('html')).toHaveClass(/\bdark\b/);
});

test('jumps to a section and moves focus to its heading', async ({ page }) => {
  await ready(page);
  await openPalette(page);
  await run(page, 'code samples', 'Code samples');

  await expect(
    page.getByRole('heading', { name: 'Three requests, five languages.' }),
  ).toBeFocused();
});

test('copies the test API key', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await ready(page);
  await openPalette(page);
  await run(page, 'api key', /Copy the test API key/);

  await expect(page.getByText('Copied the test API key.')).toBeAttached();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'fil_test_xxxxxxxxxxxx',
  );
});
