import { expect, test } from '@playwright/test';

test('the header links to every section', async ({ page }) => {
  await page.goto('./');
  const nav = page.getByRole('navigation', { name: 'Sections' });

  for (const [label, id] of [
    ['Story', 'story'],
    ['Pattern maker', 'pattern-maker'],
    ['Collection', 'collection'],
    ['Process', 'process'],
    ['Visit', 'visit'],
  ]) {
    await expect(nav.getByRole('link', { name: label })).toHaveAttribute(
      'href',
      `#${id}`,
    );
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});

test('the collection shows four pieces with fictional prices', async ({
  page,
}) => {
  await page.goto('./');
  const collection = page.locator('#collection');

  await expect(collection.getByRole('article')).toHaveCount(4);
  await expect(collection).toContainText('42,000 FCFA');
  await expect(collection).toContainText('Prices are fictional');
  await expect(
    collection.getByRole('link', {
      name: /^Ask about this piece\s*: Two leopards$/,
    }),
  ).toHaveAttribute(
    'href',
    /^mailto:atelier@example\.com\?subject=About%20the%20Two%20leopards$/,
  );
});

test('the process runs in three numbered steps', async ({ page }) => {
  await page.goto('./');

  await expect(page.locator('#process').getByRole('listitem')).toHaveCount(3);
  await expect(page.locator('#process')).toContainText('1 / 3');
});

test('the visit section gives the address and a way to write', async ({
  page,
}) => {
  await page.goto('./');
  const visit = page.locator('#visit');

  await expect(visit).toContainText('Off the Rue des Artisans');
  await expect(
    visit.getByRole('link', { name: 'Write to us' }),
  ).toHaveAttribute('href', 'mailto:atelier@example.com');
});

test('the footer names the atelier and carries the series footer', async ({
  page,
}) => {
  await page.goto('./');
  const footer = page.getByRole('contentinfo');

  await expect(footer).toContainText('Foumban, West Region, Cameroon');
  await expect(footer).toContainText('Fictional brand, design study.');
});

test('the story tells four chapters and names its sources', async ({
  page,
}) => {
  await page.goto('./');
  const story = page.locator('#story');

  await expect(story.getByRole('listitem')).toHaveCount(4);
  await expect(story).toContainText('Cameroon Grassfields');
  await expect(story).toContainText('Ndop UI');
  await expect(
    story.getByRole('link', { name: 'Cleveland Museum of Art' }),
  ).toHaveAttribute('href', 'https://clevelandart.org/art/2025.274');
});

test('nothing scrolls the page sideways, even mid-animation', async ({
  page,
}) => {
  await page.goto('./');

  for (const id of ['story', 'pattern-maker', 'collection', 'visit']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBeLessThanOrEqual(0);
  }
});
