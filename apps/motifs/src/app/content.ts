import type { PageMood } from '@motifs/pages-manifest';

/**
 * The index's copy. Sections read their words from here, never from
 * templates.
 */
/**
 * Read after every link that opens in a new tab: the index stays open
 * while a visitor tries a page or reads the source.
 */
export const links = {
  newTab: '(opens in a new tab)',
} as const;

export const header = {
  name: 'Motifs',
  count: (live: number, total: number) => `${live} of ${total} live`,
  source: 'GitHub',
} as const;

export const hero = {
  eyebrow: 'An open-source series by Valery Melou',
  title: 'Twelve motifs.',
  titleEmphasis: 'One cloth.',
  lead: 'Twelve landing pages for fictional brands, each with its own type, color, texture and motion. One component library runs under all of them: Ndop UI, built with Angular.',
  explore: 'See the motifs',
  source: 'Read the source',
  clothLabel: 'The twelve motifs',
  /** Where the name comes from; shown under the cloth. */
  origin:
    'Ndop is a cloth from the Grassfields of Cameroon, dyed indigo around stitched geometric motifs. Ndop UI is named after it. This series borrows its motifs.',
} as const;

export const identities = {
  label: '01 / One library, twelve identities',
  title: 'Same card. Same markup.',
  titleEmphasis: 'Twelve voices.',
  body: [
    'Every page restyles the same Ndop UI components through its own theme and its own copies of them. Nothing else changes hands: no other UI library, no page builder.',
    'Scroll to pass the card from page to page, or pick one.',
  ],
  pickerLabel: "Show a page's card",
} as const;

export const motifs = {
  label: '02 / The motifs',
  title: 'Twelve worlds,',
  titleEmphasis: 'one launch at a time.',
  lead: 'Four immersive, four editorial, four playful. Each launches when it meets the quality bar.',
  filterLabel: 'Filter by mood',
  comingSoon: 'Coming soon',
  visit: 'Visit',
  moods: {
    immersive: 'Immersive',
    editorial: 'Editorial',
    playful: 'Playful',
  } satisfies Record<PageMood, string>,
  /** Announced to screen readers when the filter changes. */
  showing: (count: number, mood?: string) =>
    mood
      ? `Showing ${count} ${mood.toLowerCase()} pages`
      : `Showing all ${count} pages`,
} as const;

export const making = {
  label: '03 / How it is made',
  title: 'Built to be read,',
  titleEmphasis: 'then taken apart.',
  points: [
    {
      title: 'Ndop UI, and nothing else',
      text: 'Every interactive piece comes from Ndop UI. When a page needs something Ndop lacks, it is built small, in the page, and written up for Ndop.',
    },
    {
      title: 'Each page owns its components',
      text: 'Components are copied into each app and restyled there, through tokens first. Pages share only motion helpers, the footer and this list.',
    },
    {
      title: 'Open, and honest about how',
      text: 'MIT licensed. Designed and reviewed by Valery Melou, implemented with AI coding tools, held to a published quality bar.',
    },
  ],
  codeLabel: 'Run it',
} as const;

export const siteFooter = {
  credit:
    'Designed and reviewed by Valery Melou, implemented with AI coding tools.',
  license: 'MIT licensed.',
  fiction:
    'Every brand in the series is fictional; each page is a design study.',
  links: {
    source: 'Source on GitHub',
    ndop: 'Ndop UI',
  },
} as const;
