import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  it('renders the series title, the page grid and the footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;

    expect(page.querySelector('h1')?.textContent).toContain('Motifs');
    expect(page.querySelectorAll('mt-page-card')).toHaveLength(12);
    expect(page.querySelector('footer')?.textContent).toContain(
      'implemented with AI coding tools',
    );
  });
});
