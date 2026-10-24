/**
 * Atelier Ndop's copy. Sections read their words from here, never from
 * templates.
 */
export const hero = {
  label: 'Atelier Ndop · Foumban',
  title: 'Dipped green.',
  titleAir: 'Blue in the air.',
  lead: 'Hand-dyed ndop from our atelier in Foumban. The cloth leaves the indigo pit green and turns blue as it meets the air.',
  make: 'Make your own cloth',
  collection: 'See the collection',
  alt: 'Hands lifting a bundle of raffia-tied cloth out of an indigo pit dug in red earth, the cloth still green where it has just left the dye.',
} as const;

/**
 * Where orders go. The brand is fictional, so the address is on a domain
 * reserved for examples: it opens the visitor's mail app and reaches no one.
 */
/**
 * The story of ndop. Only claims the art direction board marked as agreed
 * between its sources; claims where sources differ, or rest on one weak
 * source, are left out. The sources are listed with the section and in the
 * app's README.
 */
export const story = {
  label: 'The story of ndop',
  title: 'A cloth of the Grassfields.',
  lead: 'Ndop is the emblematic cloth of the traditional chieftaincies of the Cameroon Grassfields, in the West and North-West regions.',
  chapters: [
    {
      title: 'Strips, sewn into one cloth',
      text: 'It begins as narrow strips of hand-spun cotton, woven on a loom and sewn edge to edge into one large sheet.',
    },
    {
      title: 'Stitched, dyed, unpicked',
      text: 'The motifs are drawn on the cotton, then stitched so tightly with raffia that the dye cannot reach them. After the indigo, the stitches are unpicked, and the motifs stay white on blue.',
    },
    {
      title: 'Hung, worn, mourned in',
      text: 'Ndop hangs as a royal backdrop at state events and ceremonies, and is worn by the fon and notables. It is a cloth of mourning too, at times a king’s shroud. Princes, princesses and queen mothers still wear it at festivals and funerals.',
    },
    {
      title: 'Motifs that speak',
      text: 'Paired leopards stand for Grassfields leaders. The lozenge filled with triangles evokes the crocodile, royal power and fecundity; the diamond recalls fertility and motherhood. Tarantulas, toads and lizards carry peace, fertility and prosperity. Moons and stars appear too, with no meaning recorded.',
    },
  ],
  care: 'Ndop belongs to royalty and to mourning. We dye in its tradition and leave its meanings to those they belong to.',
  stripsImage: 'story-strips',
  stripsAlt:
    'Hands sewing long, narrow strips of white cotton together on a wooden table, beside a coil of raffia.',
  vatImage: 'story-vat',
  vatAlt:
    'An indigo vat seen from above: a round clay pot of dark dye with a copper sheen and a crown of foam, set in red earth.',
  sourcesLabel: 'Sources',
  sources: [
    {
      name: 'Cleveland Museum of Art',
      url: 'https://clevelandart.org/art/2025.274',
    },
    {
      name: 'The Met',
      url: 'https://www.metmuseum.org/art/collection/search/636847',
    },
    {
      name: 'Philadelphia Museum of Art',
      url: 'https://www.philamuseum.org/objects/181499',
    },
    {
      name: 'Kaji, 2023',
      url: 'https://medcraveonline.com/JTEFT/challenges-of-the-modernization-and-industrialization-of-the-manufacture-of-ndop-fabric-from-cameroon.html',
    },
    {
      name: 'Essel, 2021',
      url: 'https://www.explore-vc.org/en/objects/the-case-of-ndop-royal-fabric.html',
    },
    {
      name: 'Darnaude, 2023',
      url: 'https://dev.rdpc.dspace.uevora.pt/items/f2ceedfc-883b-4a41-b7dd-6d7ecbcced7d/full',
    },
  ],
} as const;

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
      alt: 'A long indigo scarf with white bands of lozenges down its length, folded on linen.',
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
      alt: 'An indigo wall piece with a dense grid of white diamonds and a border of small tarantulas, hung from a wooden bar on a mud wall.',
    },
  ] satisfies readonly Piece[],
} as const;

export const siteHeader = {
  name: 'Atelier Ndop',
  place: 'Foumban',
  navLabel: 'Sections',
  links: [
    { label: 'Story', href: '#story' },
    { label: 'Pattern maker', href: '#pattern-maker' },
    { label: 'Collection', href: '#collection' },
    { label: 'Process', href: '#process' },
    { label: 'Visit', href: '#visit' },
  ],
} as const;

export const process = {
  label: 'How we make a piece',
  title: 'Stitch, dye, unpick.',
  steps: [
    {
      title: 'Stitch',
      text: 'We draw the motifs on white cotton and stitch around them with raffia, pulled so tight that the dye cannot reach them.',
      image: 'story-stitch',
      focus: '50% 50%',
      alt: 'Hands stitching raffia around a lozenge drawn on white cotton, the cloth gathered into tight puckers.',
    },
    {
      title: 'Dye',
      text: 'The cloth goes into the pit and comes out green. In the air it turns blue, and every dip makes it deeper.',
      image: 'hero-dip',
      focus: '38% 50%',
      alt: 'Hands lifting dripping cloth out of an indigo dye pit, green turning to blue.',
    },
    {
      title: 'Unpick',
      text: 'Once it has dried, we cut and pull out every stitch. The cotton they covered stayed white: those are the motifs.',
      image: 'story-unpick',
      focus: '50% 50%',
      alt: 'Hands cutting raffia stitches from indigo cloth with a small knife, revealing the white shape they kept from the dye.',
    },
  ],
} as const;

export const visit = {
  label: 'Visit',
  title: 'Come and see the vats.',
  text: 'Our courtyard is off the Rue des Artisans, in the Njiyuom quarter of Foumban. Mornings are the best time: that is when the cloth goes in.',
  address: [
    'Off the Rue des Artisans',
    'Njiyuom, Foumban',
    'West Region, Cameroon',
  ],
  hours: 'Tuesday to Saturday, 8 am to 4 pm',
  write: 'Write to us',
  image: 'visit-courtyard',
  alt: 'A workshop courtyard of red earth, with indigo cloth drying on lines and two dye pits in the ground.',
} as const;

export const pageFooter = {
  name: 'Atelier Ndop',
  place: 'Foumban, West Region, Cameroon',
} as const;
