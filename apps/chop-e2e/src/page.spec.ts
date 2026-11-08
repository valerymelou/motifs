import { seriesFacts } from '@motifs/pages-manifest';
import { expect, test, type Page } from '@playwright/test';

const sections = [
  'year',
  'circle',
  'month',
  'book',
  'dues',
  'questions',
  'full-circle',
];

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

/** A card or caption counts as shown once it's mostly opaque. */
async function opacity(page: Page, selector: string) {
  return page
    .locator(selector)
    .evaluate((el) => Number(getComputedStyle(el).opacity));
}

test('shows every series fact in the closing ring, with working links', async ({
  page,
}) => {
  const facts = seriesFacts('chop', 'Chop');
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
  }
});

test('opens the sections menu from the dial and goes to a section', async ({
  page,
}) => {
  await page.goto('./');
  const dial = page.getByRole('button', { name: 'Sections' });
  const menu = page.getByRole('navigation', { name: 'Sections' });

  await dial.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('link')).toHaveCount(7);

  await menu.getByRole('link', { name: /Dues/ }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/#dues$/);
  await expect(page.locator('#dues')).toBeInViewport();
});

test('closes the sections menu with Escape', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Sections' }).click();
  const menu = page.getByRole('navigation', { name: 'Sections' });
  await expect(menu).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
});

test('lands every anchor at the top of its section', async ({ page }) => {
  await page.goto('./');
  await page.addStyleTag({
    content: 'html { scroll-behavior: auto !important; }',
  });
  for (const id of sections) {
    await page.goto(`./#${id}`);
    const top = await page
      .locator(`#${id}`)
      .evaluate((el) => Math.round(el.getBoundingClientRect().top));
    expect(Math.abs(top), id).toBeLessThanOrEqual(2);
  }
});

test.describe('with motion', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('turns the year wheel to each card as the page scrolls', async ({
    page,
  }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
    expect(await opacity(page, '#year .card >> nth=0')).toBeGreaterThan(0.9);

    // March's rest: its card is in, January's out.
    await scrollTrack(page, 'year', 0.27);
    await expect
      .poll(() => opacity(page, '#year .card >> nth=2'))
      .toBeGreaterThan(0.9);
    expect(await opacity(page, '#year .card >> nth=0')).toBeLessThan(0.1);

    // October, the last turn.
    await scrollTrack(page, 'year', 0.83);
    await expect
      .poll(() => opacity(page, '#year .card >> nth=5'))
      .toBeGreaterThan(0.9);
  });

  test('shows each day of the month on the phone and beside it', async ({
    page,
  }) => {
    await page.goto('./');
    const rests = [0.04, 0.27, 0.49, 0.71, 0.95];
    for (const [i, share] of rests.entries()) {
      await scrollTrack(page, 'month', share);
      await expect
        .poll(() => opacity(page, `#month .day >> nth=${i}`))
        .toBeGreaterThan(0.9);
      await expect
        .poll(() => opacity(page, `#month .screen >> nth=${i}`))
        .toBeGreaterThan(0.9);
    }
  });
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('lays the pinned sections out as columns, with nothing faded', async ({
    page,
  }) => {
    await page.goto('./');

    for (const id of ['year', 'month', 'full-circle']) {
      const height = await page
        .locator(`#${id}`)
        .evaluate(
          (el) => el.getBoundingClientRect().height / window.innerHeight,
        );
      // A pinned track is several screens tall; the column is about its content.
      expect(height, id).toBeLessThan(3.5);
    }
    for (const selector of [
      '#year .card',
      '#month .day',
      '#full-circle .fact',
    ]) {
      const cards = page.locator(selector);
      for (let i = 0; i < (await cards.count()); i++) {
        expect(await opacity(page, `${selector} >> nth=${i}`)).toBe(1);
      }
    }
  });
});
