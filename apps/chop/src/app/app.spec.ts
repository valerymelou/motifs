import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  it('renders the page heading, the calculator and the series footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;

    expect(page.querySelector('h1')?.textContent).toContain(
      'Ten friends. One pot. Every turn comes.',
    );
    expect(page.querySelector('mt-calculator-section')).not.toBeNull();
    expect(page.querySelector('mt-series-footer')).not.toBeNull();
  });
});
