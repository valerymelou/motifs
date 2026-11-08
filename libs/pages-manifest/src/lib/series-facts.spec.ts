import { seriesFacts } from './series-facts';

describe('seriesFacts', () => {
  const facts = seriesFacts('chop', 'Chop');

  it('names the page, the series and its author', () => {
    expect(facts.byline).toBe('Chop is part of Motifs by Valery Melou.');
  });

  it("links to the index, the page's source folder and Ndop UI", () => {
    expect([facts.series, facts.source, facts.ndop]).toEqual([
      { label: 'All pages', href: '/', external: false },
      {
        label: 'Source on GitHub',
        href: 'https://github.com/valerymelou/motifs/tree/master/apps/chop',
        external: true,
      },
      { label: 'Built with Ndop UI', href: 'https://ndop.dev', external: true },
    ]);
  });

  it('carries the fictional-brand note', () => {
    expect(facts.note).toBe(
      'Fictional brand, design study. Any likeness to a real business is unintended.',
    );
  });
});
