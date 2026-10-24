import { TestBed } from '@angular/core/testing';
import { findPage, type Page } from '@motifs/pages-manifest';
import { PageCard } from './page-card';

const fil = findPage('fil') as Page;

async function render(page: Page) {
  const fixture = TestBed.createComponent(PageCard);
  fixture.componentRef.setInput('page', page);
  fixture.componentRef.setInput('number', '02');
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('PageCard', () => {
  it('shows an unlaunched page as coming soon, on its motif, without a link', async () => {
    const card = await render({ ...fil, status: 'soon' });

    expect(card.textContent).toContain('Coming soon');
    expect(card.querySelector('a')).toBeNull();
    expect(card.querySelector('img')).toBeNull();
    expect(card.querySelector('.swatch-tile')).not.toBeNull();
  });

  it('links a live page and shows its Open Graph image', async () => {
    const card = await render({ ...fil, status: 'live' });

    expect(card.querySelector('a')?.getAttribute('href')).toBe('/fil/');
    expect(card.querySelector('img')?.getAttribute('src')).toBe('/fil/og.png');
    expect(card.textContent).not.toContain('Coming soon');
  });

  it('labels the page with its number and mood', async () => {
    const card = await render(fil);

    expect(card.textContent).toContain('02');
    expect(card.textContent).toContain('Editorial');
  });
});
