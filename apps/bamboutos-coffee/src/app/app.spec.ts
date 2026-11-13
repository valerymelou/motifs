import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  it('renders the page heading and the trailhead footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;

    expect(page.querySelector('h1')?.textContent).toContain('Bamboutos Coffee');
    expect(page.querySelector('footer')?.textContent).toContain(
      'Bamboutos Coffee is part of Motifs by Valery Melou.',
    );
  });
});
