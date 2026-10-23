/** A sketch of a page's theme, enough to restyle one Ndop card. */
export interface SpecimenTheme {
  readonly background: `#${string}`;
  readonly foreground: `#${string}`;
  readonly primary: `#${string}`;
  readonly primaryForeground: `#${string}`;
  /** Corner radius, as a CSS length. */
  readonly radius: string;
  /** One of the three faces the index already loads. */
  readonly font: 'serif' | 'sans' | 'mono';
  readonly uppercase: boolean;
}

/** What one page would put in the same Ndop card, in its own voice. */
export interface Specimen {
  readonly title: string;
  readonly text: string;
  readonly action: string;
  readonly badge: string;
  readonly theme: SpecimenTheme;
}

/**
 * One card per page, in its brief's colors. These are sketches for the
 * index; each page defines its full theme in its own app.
 */
export const SPECIMENS: Record<string, Specimen> = {
  'atelier-ndop': {
    title: 'Spindle and wheel scarf',
    text: 'Dyed in indigo by hand, 180 × 60 cm.',
    action: 'Order as a scarf',
    badge: 'Made to order',
    theme: {
      background: '#F3EEE2',
      foreground: '#1E3170',
      primary: '#1E3170',
      primaryForeground: '#F3EEE2',
      radius: '0.25rem',
      font: 'serif',
      uppercase: false,
    },
  },
  fil: {
    title: 'Send your first message',
    text: 'One request reaches SMS and WhatsApp.',
    action: 'Copy API key',
    badge: 'v2',
    theme: {
      background: '#0A0A0A',
      foreground: '#FAFAFA',
      primary: '#22C55E',
      primaryForeground: '#052E16',
      radius: '0.5rem',
      font: 'mono',
      uppercase: false,
    },
  },
  njangi: {
    title: 'The lunch-break circle',
    text: 'Eight friends, 25,000 FCFA a month each.',
    action: 'Join the circle',
    badge: 'Your turn: May',
    theme: {
      background: '#F4EEE4',
      foreground: '#1F3D2F',
      primary: '#2F7D5B',
      primaryForeground: '#FFFFFF',
      radius: '1.25rem',
      font: 'sans',
      uppercase: false,
    },
  },
  'bamboutos-coffee': {
    title: 'Medium roast, 250 g',
    text: 'Cherry, cocoa and a little smoke.',
    action: 'Add to cart',
    badge: 'Grown at 1,800 m',
    theme: {
      background: '#F4EAD9',
      foreground: '#3B2416',
      primary: '#B4322A',
      primaryForeground: '#FFFFFF',
      radius: '0',
      font: 'sans',
      uppercase: true,
    },
  },
  'lobe-house': {
    title: 'Room seven, sea view',
    text: 'Two nights, breakfast facing the falls.',
    action: 'Send a request',
    badge: 'Two left in May',
    theme: {
      background: '#EADBC2',
      foreground: '#173F52',
      primary: '#1F5F7A',
      primaryForeground: '#FFFFFF',
      radius: '0.75rem',
      font: 'serif',
      uppercase: false,
    },
  },
  canopee: {
    title: 'Fund a ranger for a month',
    text: 'Boots, a radio and training in the Dja.',
    action: 'Give monthly',
    badge: 'Demo',
    theme: {
      background: '#F8F6F0',
      foreground: '#14301F',
      primary: '#14301F',
      primaryForeground: '#F8F6F0',
      radius: '0.125rem',
      font: 'serif',
      uppercase: false,
    },
  },
  'terre-crue': {
    title: 'Primary school, six classrooms',
    text: 'Compressed-earth brick, cooled by its own walls.',
    action: 'View the project',
    badge: 'Schools',
    theme: {
      background: '#F5F2EC',
      foreground: '#1A1A1A',
      primary: '#A34A29',
      primaryForeground: '#FFFFFF',
      radius: '0',
      font: 'sans',
      uppercase: true,
    },
  },
  'wouri-supply': {
    title: 'Drop 07: the tee',
    text: 'Numbered, one of 150. On dit quoi?',
    action: 'Pick a size',
    badge: 'Last 2',
    theme: {
      background: '#E6FF3B',
      foreground: '#0A0A0A',
      primary: '#0A0A0A',
      primaryForeground: '#E6FF3B',
      radius: '0',
      font: 'sans',
      uppercase: true,
    },
  },
  'soya-nights': {
    title: 'The soya plate',
    text: 'Beef skewers, pepper, onions on the side.',
    action: 'Order on WhatsApp',
    badge: 'Spicy',
    theme: {
      background: '#140F0D',
      foreground: '#FBEFE6',
      primary: '#FF6B1A',
      primaryForeground: '#140F0D',
      radius: '0.5rem',
      font: 'sans',
      uppercase: false,
    },
  },
  'ciel-du-nord': {
    title: 'Perseids night',
    text: 'Guided, two hours from the nearest city light.',
    action: 'Book a seat',
    badge: 'Sample date',
    theme: {
      background: '#07090F',
      foreground: '#F1F3F8',
      primary: '#E8B04B',
      primaryForeground: '#07090F',
      radius: '0.25rem',
      font: 'mono',
      uppercase: false,
    },
  },
  'ambiance-records': {
    title: 'Makossa Nights, vol. 2',
    text: 'A reissue, twelve tracks, sleeve notes included.',
    action: 'Play the preview',
    badge: 'Vinyl',
    theme: {
      background: '#F3E9D2',
      foreground: '#111111',
      primary: '#E8643A',
      primaryForeground: '#111111',
      radius: '9999px',
      font: 'sans',
      uppercase: true,
    },
  },
  'petit-pont': {
    title: 'Bonjour, hello!',
    text: 'Three questions, two languages, no account.',
    action: 'Start the quiz',
    badge: 'Ages 5 to 9',
    theme: {
      background: '#FFF8E6',
      foreground: '#1B2A6B',
      primary: '#2357E8',
      primaryForeground: '#FFFFFF',
      radius: '1rem',
      font: 'sans',
      uppercase: false,
    },
  },
};

/**
 * A page's specimen.
 *
 * @throws When the page has none, so a new page can't ship without one.
 */
export function specimenOf(slug: string): Specimen {
  const specimen = SPECIMENS[slug];
  if (!specimen) {
    throw new Error(`No specimen for "${slug}".`);
  }
  return specimen;
}
