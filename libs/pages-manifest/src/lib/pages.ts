import type { Page, PageMood } from './types';

/** Every page in the series, in launch order. */
export const PAGES: readonly Page[] = [
  {
    slug: 'atelier-ndop',
    name: 'Atelier Ndop',
    tagline: 'Indigo cloth, dyed by hand, one motif at a time.',
    mood: 'immersive',
    accent: '#1E3170',
    status: 'live',
    ndopItems: [
      'toggle-group',
      'slider',
      'switch',
      'popover',
      'dialog',
      'tooltip',
      'button',
      'card',
    ],
  },
  {
    slug: 'fil',
    name: 'Fil',
    tagline:
      'Send SMS and WhatsApp messages across African networks with one API.',
    mood: 'editorial',
    accent: '#22C55E',
    status: 'live',
    ndopItems: [
      'command',
      'tabs',
      'table',
      'badge',
      'accordion',
      'toggle-group',
      'button',
      'tooltip',
      'dialog',
    ],
  },
  {
    slug: 'njangi',
    name: 'Njangi',
    tagline: 'Run your savings circle with friends, without the notebook.',
    mood: 'playful',
    accent: '#2F7D5B',
    status: 'soon',
    ndopItems: [
      'slider',
      'select',
      'chart',
      'accordion',
      'tabs',
      'card',
      'button',
      'badge',
    ],
  },
  {
    slug: 'bamboutos-coffee',
    name: 'Bamboutos Coffee',
    tagline: 'Single-origin coffee from smallholders on the Bamboutos slopes.',
    mood: 'immersive',
    accent: '#B4322A',
    status: 'soon',
    ndopItems: [
      'tabs',
      'select',
      'sheet',
      'toast',
      'badge',
      'accordion',
      'button',
    ],
  },
  {
    slug: 'lobe-house',
    name: 'Lobé House',
    tagline: 'Twelve rooms where the Lobé falls meet the sea.',
    mood: 'immersive',
    accent: '#1F5F7A',
    status: 'soon',
    ndopItems: [
      'date-picker',
      'popover',
      'combobox',
      'button',
      'card',
      'toast',
    ],
  },
  {
    slug: 'canopee',
    name: 'Canopée',
    tagline:
      'Funding the rangers and villages who keep the Dja forest standing.',
    mood: 'editorial',
    accent: '#14301F',
    status: 'soon',
    ndopItems: [
      'radio-group',
      'toggle-group',
      'input',
      'form-field',
      'progress',
      'button',
      'toast',
    ],
  },
  {
    slug: 'terre-crue',
    name: 'Terre Crue Studio',
    tagline: 'Schools and houses built in compressed-earth brick.',
    mood: 'editorial',
    accent: '#B5532F',
    status: 'soon',
    ndopItems: ['tabs', 'dialog', 'button'],
  },
  {
    slug: 'wouri-supply',
    name: 'Wouri Supply',
    tagline: 'Small, numbered drops from Douala.',
    mood: 'playful',
    accent: '#E6FF3B',
    status: 'soon',
    ndopItems: ['select', 'sheet', 'badge', 'toast', 'button', 'card'],
  },
  {
    slug: 'soya-nights',
    name: 'Soya Nights',
    tagline: "Yaoundé's weekly night market of soya grills and plantains.",
    mood: 'playful',
    accent: '#FF6B1A',
    status: 'soon',
    ndopItems: ['checkbox', 'drawer', 'toast', 'button', 'card', 'badge'],
  },
  {
    slug: 'ciel-du-nord',
    name: 'Ciel du Nord',
    tagline: 'Guided nights under the Sahel sky, far from city light.',
    mood: 'immersive',
    accent: '#E8B04B',
    status: 'soon',
    ndopItems: [
      'calendar',
      'hover-card',
      'form-field',
      'input',
      'select',
      'radio-group',
      'accordion',
      'button',
    ],
  },
  {
    slug: 'ambiance-records',
    name: 'Ambiance Records',
    tagline: 'Makossa and bikutsi, reissued and newly recorded.',
    mood: 'editorial',
    accent: '#E8643A',
    status: 'soon',
    ndopItems: [
      'tabs',
      'radio-group',
      'slider',
      'button',
      'card',
      'badge',
      'input',
    ],
  },
  {
    slug: 'petit-pont',
    name: 'Petit Pont',
    tagline: 'French and English for kids aged 5 to 9, learned together.',
    mood: 'playful',
    accent: '#2E6BFF',
    status: 'soon',
    ndopItems: [
      'toggle-group',
      'radio-group',
      'progress',
      'accordion',
      'button',
      'card',
    ],
  },
];

/** Moods in the order the index offers them as filters. */
export const MOODS: readonly PageMood[] = ['immersive', 'editorial', 'playful'];

/**
 * Looks a page up by its slug.
 *
 * @returns The page, or `undefined` when no page has that slug.
 */
export function findPage(slug: string): Page | undefined {
  return PAGES.find((page) => page.slug === slug);
}

/** Pages with the given mood, in launch order. */
export function pagesByMood(mood: PageMood): readonly Page[] {
  return PAGES.filter((page) => page.mood === mood);
}
