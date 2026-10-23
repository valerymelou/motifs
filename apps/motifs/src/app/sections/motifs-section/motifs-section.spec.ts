import { TestBed } from '@angular/core/testing';
import { MotifsSection } from './motifs-section';

async function render() {
  const fixture = TestBed.createComponent(MotifsSection);
  await fixture.whenStable();
  const section = fixture.nativeElement as HTMLElement;
  const button = (label: string) =>
    Array.from(section.querySelectorAll('button')).find((candidate) =>
      candidate.textContent?.trim().startsWith(label),
    );
  const titles = () =>
    Array.from(section.querySelectorAll('h3')).map((title) =>
      title.textContent?.trim(),
    );
  const summary = () =>
    section.querySelector('[aria-live]')?.textContent?.trim();
  return { fixture, section, button, titles, summary };
}

describe('MotifsSection', () => {
  it('lists every page in launch order, numbered, until a mood is picked', async () => {
    const { section, titles, summary } = await render();

    expect(titles()).toHaveLength(12);
    expect(titles()[0]).toBe('Atelier Ndop');
    expect(section.querySelector('li')?.id).toBe('atelier-ndop');
    expect(summary()).toBe('Showing all 12 pages');
  });

  it('counts the pages of each mood on its filter', async () => {
    const { button } = await render();

    expect(button('Immersive')?.textContent).toContain('04');
  });

  it('shows only the pressed mood and announces it, keeping launch numbers', async () => {
    const { fixture, section, button, titles, summary } = await render();

    button('Editorial')?.click();
    await fixture.whenStable();

    expect(titles()).toEqual([
      'Fil',
      'Canopée',
      'Terre Crue Studio',
      'Ambiance Records',
    ]);
    expect(section.querySelector('li')?.textContent).toContain('02');
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
