import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  it('renders the page heading, the samples and the series footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;

    expect(page.querySelector('h1')?.textContent).toContain(
      'One thread, every network.',
    );
    expect(page.querySelectorAll('mt-code-sample')).toHaveLength(3);
    expect(page.querySelector('mt-series-footer')).not.toBeNull();
  });
});
