import { expect, test, type Page } from '@playwright/test';

const collection = (page: Page) => page.locator('#motifs');
const cards = (page: Page) => collection(page).getByRole('listitem');

test('opens on the cloth and the series title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Motifs');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Twelve motifs.',
  );
  await expect(
    page
      .getByRole('navigation', { name: 'The twelve motifs' })
      .getByRole('link'),
  ).toHaveCount(12);
});

test('serves the Open Graph image its meta points to', async ({
  page,
  request,
}) => {
  await page.goto('/');
  const image = await page
    .locator('meta[property="og:image"]')
    .getAttribute('content');
  const response = await request.get(new URL(image ?? '', page.url()).pathname);

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/png');
});

test('names a band on focus and links it to its page in the collection', async ({
  page,
}) => {
  await page.goto('/');
  const band = page.getByRole('link', { name: '02 Fil' });

  await band.focus();
  await expect(band.locator('.band-label')).toHaveCSS('opacity', '1');
  await band.press('Enter');

  await expect(page).toHaveURL(/#fil$/);
  await expect(page.locator('#fil')).toBeInViewport();
});

test('passes the card from page to page as the section scrolls', async ({
  page,
}) => {
  await page.goto('/');
  const section = page.locator('mt-identities-section');
  const card = page.locator('mt-specimen-card');

  await section.evaluate((element) =>
    scrollTo(0, element.getBoundingClientRect().top + scrollY),
  );
  await expect(card).toContainText('Spindle and wheel scarf');
  await section.evaluate((element) => scrollBy(0, element.clientHeight * 0.45));

  await expect(card).not.toContainText('Spindle and wheel scarf');
});

test.describe('with reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test("the picker passes the card to a page's theme", async ({ page }) => {
    await page.goto('/');
    const picker = page.getByRole('group', { name: "Show a page's card" });

    await picker.getByRole('button', { name: '05 Lobé House' }).click();

    await expect(page.locator('mt-specimen-card')).toContainText(
      'Room seven, sea view',
    );
  });

  test('the cloth stays still and the collection is fully visible', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.locator('.band-track').first()).toHaveCSS(
      'animation-name',
      'none',
    );
    await collection(page).scrollIntoViewIfNeeded();
    await expect(cards(page).last()).toHaveCSS('opacity', '1');
  });
});

test('lists all twelve pages, live ones linked', async ({ page }) => {
  await page.goto('/');

  await expect(cards(page)).toHaveCount(12);
  await expect(collection(page).getByText('Coming soon')).toHaveCount(10);
  await expect(
    collection(page).getByRole('link', { name: 'Atelier Ndop' }),
  ).toHaveAttribute('href', '/atelier-ndop/');
  await expect(
    collection(page).getByRole('link', { name: 'Fil' }),
  ).toHaveAttribute('href', '/fil/');
  await expect(page.getByRole('contentinfo')).toContainText(
    'implemented with AI coding tools',
  );
});

test('opens the pages and the source in a new tab, and says so', async ({
  page,
}) => {
  await page.goto('/');

  const leaving = page.locator('a[target="_blank"]');
  // Two live pages, three GitHub links and Ndop UI.
  await expect(leaving).toHaveCount(6);
  for (const link of await leaving.all()) {
    await expect(link).toHaveAttribute('rel', 'noopener');
    await expect(link).toHaveAccessibleName(/\(opens in a new tab\)$/);
  }
  await expect(
    page.getByRole('link', { name: /^GitHub/ }).locator('svg'),
  ).toBeVisible();
});

test("lines up every card's last line in a row", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');

  const lines = cards(page).locator('article > p:last-child');
  const bottoms = await lines.evaluateAll((all) =>
    all
      .slice(0, 3)
      .map((line) => Math.round(line.getBoundingClientRect().bottom)),
  );
  expect(new Set(bottoms).size).toBe(1);
});

test('filters the collection by mood, with the keyboard too', async ({
  page,
}) => {
  await page.goto('/');
  const filter = page.getByRole('group', { name: 'Filter by mood' });

  await filter.getByRole('button', { name: /Immersive/ }).focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Space');

  await expect(filter.getByRole('button', { name: /Editorial/ })).toBeFocused();
  await expect(cards(page)).toHaveCount(4);
  await expect(cards(page).first()).toContainText('Fil');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('every section is readable from the prerendered HTML', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.locator('mt-specimen-card')).toContainText(
      'Spindle and wheel scarf',
    );
    await expect(cards(page)).toHaveCount(12);
    await expect(page.getByText('git clone')).toBeVisible();
  });
});
