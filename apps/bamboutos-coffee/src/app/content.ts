/**
 * Bamboutos Coffee's copy. Sections read their words from here, never from
 * templates. Facts about coffee in Cameroon come only from the claims
 * confirmed on the art direction board; their sources are in the app's
 * README. The roaster, its farmers, prices, roasts and recipes are
 * fictional.
 *
 * The page walks down the mountain (docs/plans/bamboutos-coffee.md): each
 * section is a stop at an altitude.
 */

/** A stop on the way down, in page order: the route card lists them. */
export interface Stop {
  id: string;
  name: string;
  /** Where the stop is, as the route card shows it. */
  altitude: string;
}

export const stops: readonly Stop[] = [
  { id: 'rim', name: 'The rim', altitude: '2,600 m' },
  { id: 'plots', name: 'The plots', altitude: '2,000 m' },
  { id: 'walk', name: 'Cherry to cup', altitude: '2,000–1,400 m' },
  { id: 'roasts', name: 'The roasts', altitude: '1,400 m' },
  { id: 'brew', name: 'Brew guide', altitude: '1,400 m' },
  { id: 'shop', name: 'The shop', altitude: '1,400 m' },
  { id: 'trailhead', name: 'The trailhead', altitude: 'The foot' },
];

/**
 * What the altimeter reads, in order down the slope: the rim, then the
 * walk's five stations. Its roll steps through these lines.
 */
export const altimeter = [
  { altitude: '2,600 m', place: 'The rim' },
  { altitude: '2,000 m', place: 'The plots' },
  { altitude: '1,850 m', place: 'Picking' },
  { altitude: '1,620 m', place: 'Washing station' },
  { altitude: '1,480 m', place: 'Drying beds' },
  { altitude: '1,400 m', place: 'The roastery' },
] as const;

export const siteHeader = {
  name: 'Bamboutos',
  coffee: 'Coffee',
  home: '#rim',
  altitude: 'Altitude',
  route: 'Route',
  routeTitle: 'The way down',
  close: 'Close',
  cart: {
    label: 'Cart',
    href: '#shop',
  },
} as const;

export const rim = {
  id: 'rim',
  name: ['Bamboutos', 'Coffee'],
  tagline: 'Single-origin coffee from smallholders on the Bamboutos slopes.',
  walk: { label: 'Walk down the slope', href: '#walk' },
  shop: { label: 'Shop the roasts', href: '#shop' },
  /** What the opener shows, for screen readers. */
  sceneLabel:
    'Dawn over the ridges of the Bamboutos massif, mist in the valleys below.',
} as const;

export interface Plot {
  /** The plot's number on the map. */
  n: number;
  farmer: string;
  altitude: string;
  size: string;
  beside: string;
  picking: string;
}

/**
 * The plots: three fictional smallholdings on the upper slope, shown
 * through their plots, never their farmers' faces. Sizes, altitudes and
 * weeks are the roaster's own, fictional.
 */
export const plots = {
  id: 'plots',
  kicker: '2,000 m · The plots',
  title: 'Grown on small plots, high on the slope.',
  intro:
    'We buy from smallholders who each work a couple of hectares, coffee among beans and plantain. Every season, only their red cherries.',
  mapLabel:
    'A contour map of the upper slope, with the three plots marked at their altitudes.',
  labels: {
    altitude: 'Altitude',
    size: 'Size',
    beside: 'Beside the coffee',
    picking: 'Picking',
  },
  items: [
    {
      n: 1,
      farmer: 'Pauline’s plot',
      altitude: '2,040 m',
      size: '1.6 ha',
      beside: 'Beans, plantain',
      picking: 'Late October to December',
    },
    {
      n: 2,
      farmer: 'Emmanuel’s plot',
      altitude: '1,960 m',
      size: '2.1 ha',
      beside: 'Bananas, maize',
      picking: 'November to mid-December',
    },
    {
      n: 3,
      farmer: 'Odile’s plot',
      altitude: '1,890 m',
      size: '1.5 ha',
      beside: 'Plantain, cocoyams',
      picking: 'Late October to December',
    },
  ] as readonly Plot[],
  prints: {
    rows: {
      photo: 'plot-rows',
      alt: 'Rows of coffee under banana trees on a terraced plot, a hoe and a basket at the end of a row.',
      caption: 'Coffee under plantain, Pauline’s plot.',
    },
    beans: {
      photo: 'green-beans',
      alt: 'Two hands holding green coffee beans over an open jute sack.',
      caption: 'Last season’s beans.',
    },
  },
} as const;

export interface Station {
  altitude: string;
  place: string;
  title: string;
  text: string;
  photo: string;
  alt: string;
}

/**
 * Cherry to cup: the walk down the slope, five stations. The process
 * facts are the board's confirmed claims; the altitudes are the roaster's
 * own, fictional.
 */
export const walk = {
  id: 'walk',
  kicker: '2,000 → 1,400 m · Cherry to cup',
  title: 'From the cherry to the cup, down the slope.',
  profileLabel:
    'The slope’s profile, from the farms at 2,000 m down to the roastery at 1,400 m.',
  stations: [
    {
      altitude: '2,000 m',
      place: 'The farms',
      title: 'Grown high, on small plots.',
      text: 'Among beans and plantain on the massif’s upper slopes, the cherries ripen from green to red.',
      photo: 'cherries-branch',
      alt: 'A coffee branch heavy with cherries, most of them ripe red, a few still green.',
    },
    {
      altitude: '1,850 m',
      place: 'Picking',
      title: 'Only the red cherries.',
      text: 'Picked by hand, a tree at a time, from October to December, as the cherries ripen.',
      photo: 'picking-hands',
      alt: 'Hands picking ripe red cherries into a woven basket.',
    },
    {
      altitude: '1,620 m',
      place: 'The washing station',
      title: 'Floated, pulped, fermented.',
      text: 'The floaters are sorted out; the rest are pulped, fermented in tanks for up to 36 hours, then washed.',
      photo: 'float-tank',
      alt: 'Red cherries poured from a basket into a concrete tank of water.',
    },
    {
      altitude: '1,480 m',
      place: 'The drying beds',
      title: 'Seven to ten days in the sun.',
      text: 'Turned on raised beds until the beans in their parchment are down to about 12% moisture.',
      photo: 'plate-beds',
      alt: 'Raised drying beds covered in pale parchment coffee on a hillside, a rake across one bed.',
    },
    {
      altitude: '1,400 m',
      place: 'The roastery',
      title: 'Roasted the week you order.',
      text: 'Light, medium or dark, then on to the shop at the foot of the slope.',
      photo: 'plate-roast',
      alt: 'Freshly roasted beans turning in the cooling tray of a small drum roaster.',
    },
  ] as readonly Station[],
} as const;

export const roasts = {
  id: 'roasts',
  kicker: '1,400 m · The roastery',
  title: 'Three roasts, from one slope.',
  intro:
    'The same washed arabica, taken to three points. Choose one to see how it’s roasted and what it tastes of.',
  tabsLabel: 'Roast',
  notes: 'Tasting notes',
  curve: {
    caption: 'How it’s roasted',
    firstCrack: 'First crack',
    drop: 'Drop',
    /** The curve in words, for its caption: the SVG is a picture of it. */
    summary: (firstCrack: string, drop: string, temp: number) =>
      `first crack at ${firstCrack}, out of the drum at ${drop} and ${temp} °C.`,
  },
  bag: { origin: 'Bamboutos, Cameroon', process: 'Washed arabica' },
  brewsBest: 'Best brewed:',
  fictional: 'Profiles, notes and prices are the roaster’s own, and fictional.',
} as const;

export interface Recipe {
  id: string;
  name: string;
  dose: string;
  water: string;
  temperature: string;
  grind: string;
  time: string;
  steps: readonly string[];
}

/** The house recipes: the roaster's own, not facts about Cameroon. */
export const brew = {
  id: 'brew',
  kicker: '1,400 m · Brew guide',
  title: 'Three ways to brew it.',
  photo: {
    name: 'cup-pourover',
    alt: 'Water poured from a kettle into a pour-over dripper over a glass carafe.',
  },
  labels: {
    dose: 'Coffee',
    water: 'Water',
    temperature: 'Temperature',
    grind: 'Grind',
    time: 'Time',
  },
  recipes: [
    {
      id: 'pour-over',
      name: 'Pour-over',
      dose: '15 g',
      water: '250 ml',
      temperature: '93 °C',
      grind: 'Medium-fine',
      time: 'About 3 min',
      steps: [
        'Rinse the paper filter with hot water and pour that water away.',
        'Pour 40 ml over the grounds and wait 30 seconds while they bloom.',
        'Pour the rest in slow circles, keeping the bed just covered.',
      ],
    },
    {
      id: 'press',
      name: 'French press',
      dose: '30 g',
      water: '500 ml',
      temperature: '94 °C',
      grind: 'Coarse',
      time: '4 min',
      steps: [
        'Pour all the water over the grounds and stir once.',
        'Put the lid on and leave it for four minutes.',
        'Press the plunger down slowly, and pour straight away.',
      ],
    },
    {
      id: 'moka',
      name: 'Moka pot',
      dose: 'Basket filled level',
      water: 'Up to the valve',
      temperature: 'Hot from the kettle',
      grind: 'Fine',
      time: 'Until it gurgles',
      steps: [
        'Fill the base with hot water to just under the valve.',
        'Fill the basket level, without pressing the coffee down.',
        'Heat it gently, lid open, and take it off as it starts to gurgle.',
      ],
    },
  ] as readonly Recipe[],
} as const;

export const shop = {
  id: 'shop',
  kicker: '1,400 m · The shop',
  title: 'Roasted the week you order.',
  note: 'Prices are fictional: Bamboutos Coffee is a design study, and nothing is sold or shipped.',
  size: 'Size',
  grind: 'Grind',
  add: 'Add to cart',
  added: 'Added to cart',
  undo: 'Undo',
  bag: (name: string) => `${name} roast`,
  cart: {
    title: 'Your cart',
    empty: 'Your cart is empty. Choose a roast above.',
    quantity: 'Quantity',
    less: (item: string) => `One less: ${item}`,
    more: (item: string) => `One more: ${item}`,
    total: 'Total',
    checkout: 'Checkout',
    checkoutNote:
      'Bamboutos Coffee is a design study: nothing is sold or shipped.',
    close: 'Close the cart',
  },
} as const;

export const trailhead = {
  id: 'trailhead',
  label: 'The trailhead',
  plate: {
    mark: 'Benchmark',
    place: 'Trailhead · the foot of the slope',
  },
  up: { label: 'Back up to the rim', href: '#rim' },
  studyNote: 'Bamboutos Coffee is a design study: nothing is sold or shipped.',
} as const;
