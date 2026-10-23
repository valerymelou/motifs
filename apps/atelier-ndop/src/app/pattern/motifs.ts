/** The motifs the pattern maker offers, each named in the sources below. */
export type MotifKind =
  | 'lozenge'
  | 'diamond'
  | 'moon'
  | 'star'
  | 'tarantula'
  | 'lizard';

export interface Motif {
  readonly kind: MotifKind;
  readonly name: string;
  /** Plural, as the cloth's description reads it. */
  readonly plural: string;
  /** What the motif stands for, as its source says. */
  readonly meaning: string;
  readonly source: string;
  /** The shape in a 48 × 48 tile, filled even-odd so holes stay open. */
  readonly path: string;
  /** Lines drawn with a stroke instead of filled, such as legs. */
  readonly lines?: string;
}

const CLEVELAND = 'Cleveland Museum of Art';
const KAJI = 'Kaji, 2023';

/** In the order the pattern maker lists them. */
export const MOTIFS: readonly Motif[] = [
  {
    kind: 'lozenge',
    name: 'Crocodile lozenge',
    plural: 'crocodile lozenges',
    meaning: 'Royal power and fecundity',
    source: CLEVELAND,
    path: 'M24 3 45 24 24 45 3 24Z M24 11 37 24 24 37 11 24Z M24 15 28 24 24 33 20 24Z',
  },
  {
    kind: 'diamond',
    name: 'Diamond',
    plural: 'diamonds',
    meaning: 'Fertility and motherhood',
    source: KAJI,
    path: 'M24 6 42 24 24 42 6 24Z M24 19 29 24 24 29 19 24Z',
  },
  {
    kind: 'moon',
    name: 'Moon',
    plural: 'moons',
    meaning: 'Shown on ndop without a stated meaning',
    source: KAJI,
    path: 'M33 6a18 18 0 0 0 0 36 22 22 0 0 1 0-36Z',
  },
  {
    kind: 'star',
    name: 'Star',
    plural: 'stars',
    meaning: 'Shown on ndop without a stated meaning',
    source: KAJI,
    path: 'M24 4 28 18 42 14 31 24 42 34 28 30 24 44 20 30 6 34 17 24 6 14 20 18Z',
  },
  {
    kind: 'tarantula',
    name: 'Tarantula',
    plural: 'tarantulas',
    meaning: 'Peace, fertility and prosperity',
    source: KAJI,
    path: 'M24 17a6 6 0 1 1 0 12 6 6 0 1 1 0-12Z M24 29a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z',
    lines:
      'M18 20 8 12 M18 24 6 22 M18 27 7 32 M19 30 10 40 M30 20 40 12 M30 24 42 22 M30 27 41 32 M29 30 38 40',
  },
  {
    kind: 'lizard',
    name: 'Lizard',
    plural: 'lizards',
    meaning: 'Peace, fertility and prosperity',
    source: KAJI,
    path: 'M22 6h4v30l-2 6-2-6Z M14 14h20v3H14Z M12 26h24v3H12Z M10 12h3v8h-3Z M35 12h3v8h-3Z M8 24h3v8H8Z M37 24h3v8h-3Z',
  },
];

/**
 * A motif by kind.
 *
 * @throws When the kind is unknown, which only a typo in data can cause.
 */
export function motif(kind: MotifKind): Motif {
  const found = MOTIFS.find((candidate) => candidate.kind === kind);
  if (!found) {
    throw new Error(`No motif "${kind}".`);
  }
  return found;
}
