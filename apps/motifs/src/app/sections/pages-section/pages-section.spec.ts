import { TestBed } from '@angular/core/testing';
import { PagesSection } from './pages-section';

async function render() {
  const fixture = TestBed.createComponent(PagesSection);
  await fixture.whenStable();
  const section = fixture.nativeElement as HTMLElement;
  const button = (label: string) =>
    Array.from(section.querySelectorAll('button')).find(
      (candidate) => candidate.textContent?.trim() === label,
    );
  const titles = () =>
    Array.from(section.querySelectorAll('h3')).map((title) =>
      title.textContent?.trim(),
    );
  const summary = () =>
    section.querySelector('[aria-live]')?.textContent?.trim();
  return { fixture, button, titles, summary };
}

describe('PagesSection', () => {
  it('lists every page, in launch order, until a mood is picked', async () => {
    const { titles, summary } = await render();

    expect(titles()).toHaveLength(12);
    expect(titles()[0]).toBe('Atelier Ndop');
    expect(summary()).toBe('Showing all 12 pages');
  });

  it('shows only the pages of the pressed mood and announces it', async () => {
    const { fixture, button, titles, summary } = await render();

    button('Editorial')?.click();
    await fixture.whenStable();

    expect(titles()).toEqual([
      'Fil',
      'Canopée',
      'Terre Crue Studio',
      'Ambiance Records',
    ]);
    expect(summary()).toBe('Showing 4 editorial pages');
  });

  it('shows every page again when the mood is released', async () => {
    const { fixture, button, titles } = await render();

    button('Playful')?.click();
    await fixture.whenStable();
    button('Playful')?.click();
    await fixture.whenStable();

    expect(titles()).toHaveLength(12);
  });
});
