import { TestBed } from '@angular/core/testing';
import { PatternMakerSection } from './pattern-maker-section';

async function render() {
  const fixture = TestBed.createComponent(PatternMakerSection);
  await fixture.whenStable();
  const section = fixture.nativeElement as HTMLElement;
  const row = (n: number) =>
    section.querySelector<HTMLElement>(`[aria-label="Row ${n}"]`);
  const motifButton = (n: number, name: string) =>
    row(n)?.querySelector<HTMLButtonElement>(`button[aria-label="${name}"]`);
  const caption = () =>
    section.querySelector('figcaption')?.textContent?.trim();
  const settle = () => fixture.whenStable();
  return { section, motifButton, caption, settle };
}

describe('PatternMakerSection', () => {
  it('starts on the default cloth, described in words', async () => {
    const { caption } = await render();

    expect(caption()).toBe(
      'Four rows: crocodile lozenges, moons, diamonds, stars. 8 motifs per row. Deep indigo, six dips.',
    );
  });

  it("changes a row's motif", async () => {
    const { motifButton, caption, settle } = await render();

    motifButton(2, 'Tarantula')?.click();
    await settle();

    expect(caption()).toContain('crocodile lozenges, tarantulas, diamonds');
    expect(motifButton(2, 'Tarantula')?.getAttribute('aria-pressed')).toBe(
      'true',
    );
  });

  it("keeps a row's motif when its pressed button is pressed again", async () => {
    const { motifButton, caption, settle } = await render();

    motifButton(1, 'Crocodile lozenge')?.click();
    await settle();

    expect(caption()).toContain('Four rows: crocodile lozenges,');
    expect(
      motifButton(1, 'Crocodile lozenge')?.getAttribute('aria-pressed'),
    ).toBe('true');
  });

  it('shows the cloth stitched, before the vat, when dyeing is off', async () => {
    const { section, caption, settle } = await render();

    section.querySelector<HTMLButtonElement>('button[role="switch"]')?.click();
    await settle();

    expect(caption()).toContain('Stitched, not yet dyed.');
    expect(section.querySelector('.dyed')?.classList).not.toContain('shown');
  });

  it('links each motif button to its row group', async () => {
    const { section } = await render();

    for (const n of [1, 2, 3, 4]) {
      expect(
        section.querySelectorAll(`[aria-label="Row ${n}"] button`),
      ).toHaveLength(6);
    }
  });
});
