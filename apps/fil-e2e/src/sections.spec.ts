import { expect, test } from '@playwright/test';

test('coverage lists 25 countries by region, with their dialling codes', async ({
  page,
}) => {
  await page.goto('./');
  const coverage = page.locator('#coverage');

  await expect(coverage.locator('.knot')).toHaveCount(5);
  await expect(coverage.locator('.knot li')).toHaveCount(25);
  await expect(coverage).toContainText('Cameroon +237');
});

test('pricing follows the monthly volume', async ({ page }) => {
  await page.goto('./');
  const pricing = page.locator('#pricing');
  const smsCentral = pricing.getByRole('row', { name: /SMS, per part/ });

  await expect(smsCentral).toContainText('$0.0340');
  await pricing.getByRole('button', { name: 'Over 100,000' }).click();
  await expect(smsCentral).toContainText('$0.0238');
});

test('the counter switches to UCS-2 on one ê, names it and says so', async ({
  page,
}) => {
  await page.goto('./');
  const field = page.getByRole('textbox', { name: 'Your message' });

  await expect(page.locator('mt-segment-counter')).toContainText('GSM 7-bit');
  await field.fill('Bonne fête à Buea');

  const counter = page.locator('mt-segment-counter');
  await expect(counter).toContainText('UCS-2');
  await expect(counter).toContainText('ê switches this message to UCS-2.');
  await expect(counter.locator('[aria-live]')).toHaveText(
    'UCS-2, 1 part, $0.0340.',
  );
});

test('the counter splits a long message into parts', async ({ page }) => {
  await page.goto('./');

  await page
    .getByRole('textbox', { name: 'Your message' })
    .fill('a'.repeat(161));

  await expect(page.locator('mt-segment-counter')).toContainText('2 parts');
});

test('FAQ answers open with the keyboard', async ({ page }) => {
  await page.goto('./');
  const question = page.getByRole('button', {
    name: 'Why did my French message cost two SMS?',
  });

  await question.focus();
  await page.keyboard.press('Enter');

  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#faq')).toContainText('"café" costs one SMS');
});

test('the changelog lists its entries newest first', async ({ page }) => {
  await page.goto('./');

  await expect(page.locator('#changelog time').first()).toHaveAttribute(
    'datetime',
    '2026-10-14',
  );
});

test('nothing scrolls the page sideways', async ({ page }) => {
  await page.goto('./');

  for (const id of ['code', 'features', 'coverage', 'pricing', 'faq']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBeLessThanOrEqual(0);
  }
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the palette and FAQ answers open without animating', async ({
    page,
  }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    expect(
      await page
        .locator('[data-slot="dialog-content"]')
        .evaluate((el) => getComputedStyle(el).animationName),
    ).toBe('none');
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: 'How long can an SMS be?' }).click();
    expect(
      await page
        .locator('[data-slot="accordion-content"][data-state="open"]')
        .evaluate((el) => getComputedStyle(el).animationName),
    ).toBe('none');
  });

  test('the thread is drawn in full and the knots are filled', async ({
    page,
  }) => {
    await page.goto('./');

    const knot = await page
      .locator('#coverage .knot')
      .first()
      .evaluate((el) => getComputedStyle(el, '::after').opacity);
    expect(knot).toBe('1');
  });
});
