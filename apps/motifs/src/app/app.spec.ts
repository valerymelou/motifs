import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  it('renders the header, the cloth, the headline and the footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;

    expect(page.querySelector('h1')?.textContent).toContain('Twelve motifs.');
    expect(
      page.querySelectorAll('nav[aria-label="The twelve motifs"] a'),
    ).toHaveLength(12);
    expect(page.querySelector('footer')?.textContent).toContain(
      'implemented with AI coding tools',
    );
  });
});
