import { TestBed } from '@angular/core/testing';
import { findPage, type Page } from '@motifs/pages-manifest';
import { provideIcons } from '../../lib/icons';
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
  beforeEach(() =>
    TestBed.configureTestingModule({ providers: [provideIcons()] }),
  );

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
    // The index stays open behind the page, and screen readers hear so.
    expect(card.querySelector('a')?.getAttribute('target')).toBe('_blank');
    expect(card.querySelector('a')?.textContent).toContain(
      '(opens in a new tab)',
    );
    expect(card.querySelector('svg')).not.toBeNull();
    expect(card.querySelector('img')?.getAttribute('src')).toBe('/fil/og.png');
    expect(card.textContent).not.toContain('Coming soon');
  });

  it('labels the page with its number and mood', async () => {
    const card = await render(fil);

    expect(card.textContent).toContain('02');
    expect(card.textContent).toContain('Editorial');
  });
});
