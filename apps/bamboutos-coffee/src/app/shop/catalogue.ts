/**
 * What the roaster sells: three roasts, two bag sizes and four grinds, with
 * prices in FCFA. All fictional (docs/plans/bamboutos-coffee.md, decision
 * 5), and marked so on the page.
 */

export type RoastId = 'light' | 'medium' | 'dark';
export type Weight = '250g' | '1kg';
export type Grind = 'whole' | 'espresso' | 'filter' | 'press';

/** A roast's profile, for its curve: times in minutes, temperatures in °C. */
export interface RoastProfile {
  /** The drum's temperature when the beans go in. */
  readonly charge: number;
  /** The lowest the beans' temperature falls, and when. */
  readonly turning: { readonly time: number; readonly temp: number };
  /** When first crack starts. */
  readonly firstCrack: number;
  /** When the beans come out, and how hot they are. */
  readonly drop: { readonly time: number; readonly temp: number };
}

export interface Roast {
  readonly id: RoastId;
  readonly name: string;
  readonly notes: readonly string[];
  readonly text: string;
  readonly photo: string;
  readonly profile: RoastProfile;
  /** The brew guide's method it suits best. */
  readonly brew: string;
  readonly price: Readonly<Record<Weight, number>>;
}

export const ROASTS: readonly Roast[] = [
  {
    id: 'light',
    name: 'Light',
    notes: ['Red currant', 'Hibiscus', 'Honey'],
    text: 'Taken off just after first crack, so the fruit stays bright.',
    photo: 'bag-light',
    profile: {
      charge: 200,
      turning: { time: 1.5, temp: 92 },
      firstCrack: 8.2,
      drop: { time: 9.5, temp: 205 },
    },
    brew: 'pour-over',
    price: { '250g': 5_000, '1kg': 17_000 },
  },
  {
    id: 'medium',
    name: 'Medium',
    notes: ['Red currant', 'Cocoa', 'Brown sugar'],
    text: 'Bright at first, then round and sweet as it cools.',
    photo: 'bag-medium',
    profile: {
      charge: 200,
      turning: { time: 1.5, temp: 92 },
      firstCrack: 8.3,
      drop: { time: 10.75, temp: 214 },
    },
    brew: 'press',
    price: { '250g': 4_500, '1kg': 15_000 },
  },
  {
    id: 'dark',
    name: 'Dark',
    notes: ['Dark chocolate', 'Molasses', 'Toasted walnut'],
    text: 'Roasted on towards second crack, for a heavy cup that takes milk.',
    photo: 'bag-dark',
    profile: {
      charge: 205,
      turning: { time: 1.5, temp: 94 },
      firstCrack: 8.5,
      drop: { time: 12.25, temp: 226 },
    },
    brew: 'moka',
    price: { '250g': 4_500, '1kg': 15_000 },
  },
];

export const WEIGHTS: readonly {
  readonly id: Weight;
  readonly label: string;
}[] = [
  { id: '250g', label: '250 g' },
  { id: '1kg', label: '1 kg' },
];

export const GRINDS: readonly { readonly id: Grind; readonly label: string }[] =
  [
    { id: 'whole', label: 'Whole bean' },
    { id: 'espresso', label: 'Espresso' },
    { id: 'filter', label: 'Filter' },
    { id: 'press', label: 'French press' },
  ];

const grouped = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });

/**
 * An amount in FCFA, grouped by thousands, its unit kept on the same line.
 *
 * @param amount - Whole francs.
 * @returns Such as "4,500 FCFA".
 */
export function fcfa(amount: number): string {
  return `${grouped.format(amount)}\u00a0FCFA`;
}

/**
 * Looks a roast up by its id.
 *
 * @throws When there is no such roast: ids come from this file only.
 */
export function roastById(id: RoastId): Roast {
  const roast = ROASTS.find((item) => item.id === id);
  if (!roast) {
    throw new Error(`No roast "${id}".`);
  }
  return roast;
}

export function weightLabel(id: Weight): string {
  return WEIGHTS.find((item) => item.id === id)?.label ?? id;
}

export function grindLabel(id: Grind): string {
  return GRINDS.find((item) => item.id === id)?.label ?? id;
}
