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
  cart: { label: 'Cart', href: '#shop' },
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
