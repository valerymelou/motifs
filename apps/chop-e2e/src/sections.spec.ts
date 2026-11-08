import { expect, test } from '@playwright/test';

test('switches the prices between monthly and yearly', async ({ page }) => {
  await page.goto('./');
  const pricing = page.locator('#dues');
  await pricing.scrollIntoViewIfNeeded();
  const yearly = pricing.getByRole('button', { name: 'Yearly' });

  await expect(pricing).toContainText('1,500 FCFA');
  await yearly.click();
  await expect(yearly).toHaveAttribute('aria-pressed', 'true');
  await expect(pricing).toContainText('15,000 FCFA');
  await expect(pricing).toContainText('Two months free');
});

test('opens an FAQ answer by keyboard', async ({ page }) => {
  await page.goto('./');
  const question = page.getByRole('button', {
    name: 'Does Chop hold our money?',
  });
  await question.focus();
  await expect(question).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Enter');

  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#questions')).toContainText(
    'You pay each other as you always have.',
  );
});

test('says there is no app behind the store buttons', async ({ page }) => {
  await page.goto('./');
  const iphone = page.getByRole('link', { name: 'iPhone' });

  await expect(iphone).toHaveAttribute('href', '#full-circle');
  await expect(iphone).toHaveAccessibleDescription(
    'Chop is a design study: there’s no app to download.',
  );
});

test('keeps the drawn phone out of the tab order and the reading order', async ({
  page,
}) => {
  await page.goto('./');

  await expect(page.locator('mt-phone')).toHaveAttribute('inert', '');
  await expect(page.locator('mt-phone')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.getByRole('button', { name: 'Approve' })).toHaveCount(0);
  await expect(page.locator('#month figure')).toHaveAccessibleName(
    /four weeks of Mami Ama’s circle/,
  );
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the year wheel stays on January as the page scrolls', async ({
    page,
  }) => {
    await page.goto('./');
    const wheel = page.locator('#year .decor');
    const rest = await wheel.evaluate((el) => getComputedStyle(el).transform);

    await page.mouse.wheel(0, 600);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(300);

    expect(await wheel.evaluate((el) => getComputedStyle(el).transform)).toBe(
      rest,
    );
    expect(rest).toBe('none');
  });
});
