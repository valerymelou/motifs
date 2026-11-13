import { seriesFacts } from '@motifs/pages-manifest';
import { expect, test } from '@playwright/test';

test('shows every series fact at the trailhead, with working links', async ({
  page,
}) => {
  const facts = seriesFacts('bamboutos-coffee', 'Bamboutos Coffee');
  await page.goto('./');
  const footer = page.getByRole('contentinfo');

  await expect(footer).toContainText(facts.byline);
  await expect(footer).toContainText(facts.note);
  await expect(
    footer.getByRole('link', { name: facts.series.label }),
  ).toHaveAttribute('href', facts.series.href);
  for (const link of [facts.source, facts.ndop]) {
    const anchor = footer.getByRole('link', {
      name: `${link.label} (opens in a new tab)`,
    });
    await expect(anchor).toHaveAttribute('href', link.href);
    await expect(anchor).toHaveAttribute('target', '_blank');
    await expect(anchor).toHaveAttribute('rel', 'noopener');
  }
});

test('opens the route card by keyboard and closes it with Escape', async ({
  page,
}) => {
  await page.goto('./');
  const button = page.getByRole('button', { name: 'Route' });
  const route = page.getByRole('navigation', { name: 'Route' });

  await button.focus();
  await page.keyboard.press('Enter');
  await expect(route).toBeVisible();
  await expect(route.getByRole('link')).toHaveCount(7);
  await expect(route.getByRole('link').first()).toContainText('2,600 m');

  await page.keyboard.press('Escape');
  await expect(route).toBeHidden();
});

test('goes back up to the rim from the trailhead', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('link', { name: 'Back up to the rim' }).click();

  await expect(page).toHaveURL(/#rim$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
});

test.describe('with motion', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('pins the rim while the mist rises, then lets go', async ({ page }) => {
    await page.goto('./');
    const rim = page.locator('#rim');
    const height = await rim.evaluate(
      (el) => el.getBoundingClientRect().height / window.innerHeight,
    );
    // A track about two screens tall, whose stage stays on screen.
    expect(height).toBeGreaterThan(1.8);

    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.6));
    await expect(page.locator('#rim .stage')).toBeInViewport({ ratio: 0.9 });
  });
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('shows the rim as one still screen', async ({ page }) => {
    await page.goto('./');
    const height = await page
      .locator('#rim')
      .evaluate((el) => el.getBoundingClientRect().height / window.innerHeight);

    expect(height).toBeLessThanOrEqual(1.01);
    await expect(page.locator('#rim .mist')).toHaveCSS('opacity', '0');
  });
});
