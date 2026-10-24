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
      link.textContent,
      link.getAttribute('href'),
    ]);

    expect(links).toEqual([
      ['All pages', '/'],
      [
        'Source on GitHub',
        'https://github.com/valerymelou/motifs/tree/master/apps/fil',
      ],
      ['Built with Ndop UI', 'https://ndop.dev'],
    ]);
  });

  it('carries the fictional-brand note', async () => {
    const footer = await render('fil');

    expect(footer.textContent).toContain('Fictional brand, design study.');
  });
});
