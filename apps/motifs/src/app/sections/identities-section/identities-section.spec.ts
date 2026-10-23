import { TestBed } from '@angular/core/testing';
import { IdentitiesSection } from './identities-section';

// With reduced motion, scrolling doesn't step through the pages, so the
// picker alone decides the card, as it does for those visitors.
beforeEach(() => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: true,
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
});
afterEach(() => vi.unstubAllGlobals());

async function render() {
  const fixture = TestBed.createComponent(IdentitiesSection);
  await fixture.whenStable();
  const section = fixture.nativeElement as HTMLElement;
  const card = () => section.querySelector('mt-specimen-card') as HTMLElement;
  return { fixture, section, card };
}

describe('IdentitiesSection', () => {
  it("starts on the first page's card", async () => {
    const { card } = await render();

    expect(card().textContent).toContain('Spindle and wheel scarf');
    expect(card().style.getPropertyValue('--card')).toBe('#F3EEE2');
  });

  it("restyles the same card with a picked page's theme", async () => {
    const { fixture, section, card } = await render();

    section
      .querySelector<HTMLButtonElement>('button[aria-label="02 Fil"]')
      ?.click();
    await fixture.whenStable();

    expect(card().textContent).toContain('Send your first message');
    expect(card().style.getPropertyValue('--primary')).toBe('#22C55E');
    expect(card().style.getPropertyValue('font-family')).toBe(
      'var(--font-mono)',
    );
  });

  it('offers every page in the picker', async () => {
    const { section } = await render();

    expect(section.querySelectorAll('button')).toHaveLength(12);
  });
});
