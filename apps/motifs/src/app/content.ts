import type { PageMood } from '@motifs/pages-manifest';

/** The index's copy. Sections read their words from here, never from templates. */
export const intro = {
  title: 'Motifs',
  lead: 'Twelve landing pages for fictional brands. Each has its own type, color, texture and motion, and all of them are built with one component library.',
  body: [
    'Every page is an Angular app that restyles Ndop UI through its own theme and its own copies of the components, with no other UI library.',
    'The source is MIT licensed and written to be read: small components, signals, and content kept as data.',
  ],
  links: {
    source: 'Source on GitHub',
    ndop: 'Ndop UI',
  },
} as const;

export const pagesSection = {
  title: 'The pages',
  filterLabel: 'Filter by mood',
  comingSoon: 'Coming soon',
  /** Announced to screen readers when the filter changes. */
  showing: (count: number, mood?: string) =>
    mood
      ? `Showing ${count} ${mood.toLowerCase()} pages`
      : `Showing all ${count} pages`,
  moods: {
    immersive: 'Immersive',
    editorial: 'Editorial',
    playful: 'Playful',
  } satisfies Record<PageMood, string>,
} as const;

export const siteFooter = {
  credit:
    'Designed and reviewed by Valery Melou, implemented with AI coding tools.',
  license: 'MIT licensed.',
  fiction:
    'Every brand in the series is fictional; each page is a design study.',
} as const;
