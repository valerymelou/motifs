import { SITE } from './site';

/** A link the series asks every page to carry. */
export interface SeriesLink {
  label: string;
  href: string;
  /** Whether it leaves the site, and so opens in a new tab. */
  external: boolean;
}

/**
 * What every page owes the series, whatever its header and footer look
 * like: which series it belongs to, where its source lives, what it's built
 * with, and that its brand is fictional. Pages lay these out in their own
 * way. `<mt-series-footer>`, the plain strip, spells the same facts out
 * rather than importing them, to keep them out of its pages' bundles; its
 * test checks that the two agree.
 */
export interface SeriesFacts {
  /** "Chop is part of Motifs by Valery Melou." */
  byline: string;
  /** The index, where every page is listed. */
  series: SeriesLink;
  /** The page's own folder in the repository. */
  source: SeriesLink;
  ndop: SeriesLink;
  note: string;
}

/**
 * The series facts for one page.
 *
 * @param slug - The page's slug in the manifest, which names its source folder.
 * @param name - The page's name, as the manifest writes it.
 * @returns The facts, ready to lay out.
 */
export function seriesFacts(slug: string, name: string): SeriesFacts {
  return {
    byline: `${name} is part of ${SITE.name} by ${SITE.author}.`,
    series: { label: 'All pages', href: '/', external: false },
    source: {
      label: 'Source on GitHub',
      href: `${SITE.repoUrl}/tree/master/apps/${slug}`,
      external: true,
    },
    ndop: { label: 'Built with Ndop UI', href: SITE.ndopUrl, external: true },
    note: 'Fictional brand, design study. Any likeness to a real business is unintended.',
  };
}
