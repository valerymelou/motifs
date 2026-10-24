import { expect, test } from '@playwright/test';

test('switching one sample switches them all', async ({ page }) => {
  await page.goto('./');
  const first = page.getByRole('tablist', { name: 'Send an SMS: language' });

  await first.getByRole('tab', { name: 'Go' }).click();

  await expect(
    page.locator('#code [role="tab"][data-state="active"]'),
  ).toHaveText(['Go', 'Go', 'Go']);
});

test('the language tabs work with the arrow keys', async ({ page }) => {
  await page.goto('./');
  const tabs = page.getByRole('tablist', { name: 'Send an SMS: language' });

  await tabs.getByRole('tab', { name: 'curl' }).focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');

  await expect(tabs.getByRole('tab', { name: 'Node' })).toHaveAttribute(
    'data-state',
    'active',
  );
});

test('a test send is queued, then delivered, and says so', async ({ page }) => {
  await page.goto('./');
  const sample = page.locator('mt-code-sample').first();

  await sample.getByRole('button', { name: 'Send test' }).click();

  await expect(sample.locator('[aria-live]')).toContainText('Queued');
  await expect(sample.locator('[aria-live]')).toContainText('Delivered');
});

test('copies the sample shown', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('./');

  await page
    .getByRole('button', { name: 'Copy the curl sample: Send an SMS' })
    .click();

  expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(
    /^curl https:\/\/api\.fil\.example\/v1\/messages/,
  );
});

test('switching languages moves nothing below the samples', async ({
  page,
}) => {
  await page.goto('./');
  const tabs = page.getByRole('tablist', { name: 'Send an SMS: language' });
  const below = page.locator('#features');
  const top = async () =>
    below.evaluate((el) => el.getBoundingClientRect().top + scrollY);

  const before = await top();
  for (const language of ['Node', 'Python', 'PHP', 'Go']) {
    await tabs.getByRole('tab', { name: language, exact: true }).click();
    expect(await top()).toBe(before);
  }
});
