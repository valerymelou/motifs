import { expect, test, type Page } from '@playwright/test';

/** Scrolls to a share of a pinned section's track, 0 to 1. */
async function scrollTrack(page: Page, id: string, share: number) {
  await page.evaluate(
    ([id, share]) => {
      const section = document.getElementById(id as string);
      if (!section) return;
      const top = section.getBoundingClientRect().top + window.scrollY;
      const span = section.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: top + span * (share as number),
        behavior: 'instant',
      });
    },
    [id, share],
  );
}

async function opacity(page: Page, selector: string) {
  return page
    .locator(selector)
    .evaluate((el) => Number(getComputedStyle(el).opacity));
}

test('shows three plots, each with its altitude and size', async ({ page }) => {
  await page.goto('./');
  const plots = page.locator('#plots');

  await expect(plots.getByRole('heading', { level: 3 })).toHaveText([
    'Pauline’s plot',
    'Emmanuel’s plot',
    'Odile’s plot',
  ]);
  await expect(plots).toContainText('2,040 m');
  await expect(plots).toContainText('2.1 ha');
});

test.describe('with motion', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('walks the bean down through each station, plate and caption', async ({
    page,
  }) => {
    await page.goto('./');
    const rests = [0.04, 0.24, 0.44, 0.64, 0.92];
    const altitudes = ['2,000 m', '1,850 m', '1,620 m', '1,480 m', '1,400 m'];

    for (const [i, share] of rests.entries()) {
      await scrollTrack(page, 'walk', share);
      await expect
        .poll(() => opacity(page, `#walk .station-item >> nth=${i}`))
        .toBeGreaterThan(0.9);
      await expect(
        page.locator('#walk .station-item').nth(i).locator('.mount'),
      ).toContainText(altitudes[i] ?? '');
    }
  });
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('lays the walk out as five captioned figures', async ({ page }) => {
    await page.goto('./');
    const figures = page.locator('#walk figure');

    await expect(figures).toHaveCount(5);
    for (let i = 0; i < 5; i++) {
      expect(await opacity(page, `#walk .station-item >> nth=${i}`)).toBe(1);
    }
    const height = await page
      .locator('#walk')
      .evaluate((el) => el.getBoundingClientRect().height / window.innerHeight);
    // Its content's height, not a six-screen track.
    expect(height).toBeLessThan(5.5);
  });
});
