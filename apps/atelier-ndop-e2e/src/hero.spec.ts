import { expect, test } from '@playwright/test';

test('the hero opens on the green cloth, with the blue frame over it', async ({
  page,
}) => {
  await page.goto('./');
  const [green, blue] = await page.locator('.hero img').all();

  await expect(green).toHaveAttribute('fetchpriority', 'high');
  await expect(green).toHaveAttribute('alt', /still green/);
  expect(
    await green.evaluate((img: HTMLImageElement) => img.currentSrc),
  ).toMatch(/images\/hero-dip-(square-)?\d+\.webp$/);
  // The blue frame repeats the same scene, so assistive tech skips it.
  await expect(blue).toHaveAttribute('alt', '');
  await expect(blue).toHaveCSS('opacity', '1', { timeout: 10_000 });
});

test('the hero links to the pattern maker and the collection', async ({
  page,
}) => {
  await page.goto('./');
  const hero = page.locator('.hero');

  await expect(
    hero.getByRole('link', { name: 'Make your own cloth' }),
  ).toHaveAttribute('href', '#pattern-maker');
  await expect(
    hero.getByRole('link', { name: 'See the collection' }),
  ).toHaveAttribute('href', '#collection');
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the hero shows the blue cloth only, with no crossfade', async ({
    page,
  }) => {
    await page.goto('./');
    const [green, blue] = await page.locator('.hero img').all();

    // The picture's reduced-motion source swaps the green frame for the blue
    // one, so the hero fetches no green photo of its own.
    expect(
      await green.evaluate((img: HTMLImageElement) => img.currentSrc),
    ).toMatch(/images\/hero-dip-blue-(square-)?\d+\.webp$/);
    await expect(blue).toBeHidden();
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the hero keeps the green cloth and never fetches the blue', async ({
    page,
  }) => {
    const fetched: string[] = [];
    page.on('request', (request) => fetched.push(request.url()));

    await page.goto('./', { waitUntil: 'load' });

    await expect(page.locator('.hero img.air')).not.toHaveAttribute('src', /./);
    expect(fetched.filter((url) => url.includes('hero-dip-blue'))).toEqual([]);
  });
});
