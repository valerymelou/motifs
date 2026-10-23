/**
 * Atelier Ndop's copy. Sections read their words from here, never from
 * templates.
 */
export const hero = {
  title: 'Atelier Ndop',
  tagline: 'Indigo cloth, dyed by hand, one motif at a time.',
} as const;

/**
 * Where orders go. The brand is fictional, so the address is on a domain
 * reserved for examples: it opens the visitor's mail app and reaches no one.
 */
export const ORDER_ADDRESS = 'atelier@example.com';

export const patternMaker = {
  label: 'Make your own cloth',
  title: 'Choose a motif for each row.',
  lead: 'We stitch your pattern in raffia, dye it in the pit, and unpick it by hand. Each motif below is one the sources record on ndop cloth.',
  rowLabel: (row: number) => `Row ${row}`,
  densityLabel: 'Motifs per row',
  depthLabel: 'Depth of indigo',
  depthHint: 'Each dip in the vat makes the blue deeper.',
  dyeLabel: 'Dye the cloth',
  dyeHint: 'Off shows the cloth stitched, before the vat.',
  order: 'Order as a scarf',
  clothLabel: 'Your cloth',
  dialog: {
    title: 'Your cloth, as a scarf',
    size: '180 × 60 cm, hand-stitched, dyed and unpicked in Foumban.',
    note: 'Nothing is charged here. Write to us and we will reply with a price and a date.',
    send: 'Email the atelier',
    close: 'Close',
    subject: 'A scarf from the pattern maker',
    body: (description: string, code: string) =>
      `Hello,\n\nI would like this cloth as a scarf:\n${description}\n\nPattern: ${code}\n`,
  },
} as const;

/** A piece in the collection. Prices are fictional, and the page says so. */
export interface Piece {
  readonly name: string;
  readonly kind: 'Scarf' | 'Wall piece';
  readonly motifs: string;
  /** Width × height, in centimetres. */
  readonly size: string;
  readonly priceFcfa: number;
  /** The photo's file name in public/images, without its size or format. */
  readonly image: string;
  readonly alt: string;
}

export const collection = {
  label: 'The collection',
  title: 'Four pieces, dyed this season.',
  priceNote: 'Prices are fictional: this atelier is a design study.',
  ask: 'Ask about this piece',
  price: (fcfa: number) => `${fcfa.toLocaleString('en-US')} FCFA`,
  pieces: [
    {
      name: 'Crocodile lozenge scarf',
      kind: 'Scarf',
      motifs: 'Rows of triangle-filled lozenges',
      size: '180 × 60 cm',
      priceFcfa: 42000,
      image: 'piece-scarf-lozenge',
      alt: 'A long indigo scarf with rows of white triangle-filled lozenges, folded on linen.',
    },
    {
      name: 'Moon and star scarf',
      kind: 'Scarf',
      motifs: 'Crescent moons and stars',
      size: '180 × 60 cm',
      priceFcfa: 38000,
      image: 'piece-scarf-moon',
      alt: 'An indigo scarf with small white moons and stars, draped over a wooden rail.',
    },
    {
      name: 'Two leopards',
      kind: 'Wall piece',
      motifs: 'Paired leopards in a border of lozenges',
      size: '200 × 120 cm',
      priceFcfa: 185000,
      image: 'piece-wall-leopards',
      alt: 'A large indigo wall hanging with two white leopards walking in profile, framed by lozenges.',
    },
    {
      name: 'Diamonds and tarantulas',
      kind: 'Wall piece',
      motifs: 'A grid of diamonds and tarantulas',
      size: '120 × 90 cm',
      priceFcfa: 96000,
      image: 'piece-wall-diamonds',
      alt: 'An indigo wall piece with a dense grid of white diamonds and small tarantula figures.',
    },
  ] satisfies readonly Piece[],
} as const;
