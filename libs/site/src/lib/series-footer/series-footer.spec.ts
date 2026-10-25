import { TestBed } from '@angular/core/testing';
import { SeriesFooter } from './series-footer';

async function render(slug: string) {
  const fixture = TestBed.createComponent(SeriesFooter);
  fixture.componentRef.setInput('slug', slug);
  fixture.componentRef.setInput('name', 'Fil');
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('SeriesFooter', () => {
  it('names the page and the series', async () => {
    const footer = await render('fil');

    expect(footer.textContent).toContain(
      'Fil is part of Motifs by Valery Melou.',
    );
  });

  it("links to the index, the page's source folder and Ndop UI", async () => {
    const footer = await render('fil');
    const links = Array.from(footer.querySelectorAll('nav a')).map((link) => [
      link.textContent?.trim(),
      link.getAttribute('href'),
      link.getAttribute('target'),
    ]);

    // The series' links stay on the site; the others open in a new tab and
    // say so to screen readers.
    expect(links).toEqual([
      ['All pages', '/', null],
      [
        'Source on GitHub (opens in a new tab)',
        'https://github.com/valerymelou/motifs/tree/master/apps/fil',
        '_blank',
      ],
      ['Built with Ndop UI (opens in a new tab)', 'https://ndop.dev', '_blank'],
    ]);
  });

  it('carries the fictional-brand note', async () => {
    const footer = await render('fil');

    expect(footer.textContent).toContain('Fictional brand, design study.');
  });
});
