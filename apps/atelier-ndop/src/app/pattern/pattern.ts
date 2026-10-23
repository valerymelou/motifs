import { motif, type MotifKind } from './motifs';

/** How dark the indigo is, which comes from how many times it's dipped. */
export type IndigoDepth = 'pale' | 'medium' | 'deep' | 'night';

export interface Depth {
  readonly depth: IndigoDepth;
  readonly name: string;
  readonly dips: string;
  /** The cloth's color at this depth, as a CSS hex value. */
  readonly color: `#${string}`;
}

/** From lightest to darkest. */
export const DEPTHS: readonly Depth[] = [
  { depth: 'pale', name: 'Pale indigo', dips: 'one dip', color: '#56709F' },
  { depth: 'medium', name: 'Indigo', dips: 'three dips', color: '#34508F' },
  { depth: 'deep', name: 'Deep indigo', dips: 'six dips', color: '#1E3170' },
  { depth: 'night', name: 'Night indigo', dips: 'ten dips', color: '#111A40' },
];

/** A cloth the visitor designs. */
export interface Pattern {
  /** One motif per row, top to bottom. */
  readonly rows: readonly MotifKind[];
  /** Motifs per row. */
  readonly density: number;
  readonly depth: IndigoDepth;
  /** False shows the stitched cloth before it goes into the vat. */
  readonly dyed: boolean;
}

export const DENSITY = { min: 4, max: 12 } as const;

export const DEFAULT_PATTERN: Pattern = {
  rows: ['lozenge', 'moon', 'diamond', 'star'],
  density: 8,
  depth: 'deep',
  dyed: true,
};

/** One motif placed on the cloth. */
export interface Placement {
  readonly kind: MotifKind;
  /** An SVG transform that moves and scales the 48 × 48 tile into place. */
  readonly transform: string;
}

export interface ClothLayout {
  readonly width: number;
  readonly height: number;
  /** Where the narrow woven strips were sewn together. */
  readonly seams: readonly number[];
  readonly placements: readonly Placement[];
}

const WIDTH = 960;
const HEIGHT = 600;
const STRIP_WIDTH = 120;

/**
 * Lays the pattern out on a 960 × 600 cloth. Each motif is nudged and turned
 * a little, the same way every time, as a hand-stitched resist would be.
 */
export function layoutCloth(pattern: Pattern): ClothLayout {
  const rowHeight = HEIGHT / pattern.rows.length;
  const cellWidth = WIDTH / pattern.density;
  const size = Math.min(rowHeight * 0.62, cellWidth * 0.78);
  const scale = size / 48;

  const placements = pattern.rows.flatMap((kind, row) =>
    Array.from({ length: pattern.density }, (_, column) => {
      const wobble = handWobble(row * 31 + column);
      const x = (column + 0.5) * cellWidth - size / 2 + wobble.dx;
      const y = (row + 0.5) * rowHeight - size / 2 + wobble.dy;
      return {
        kind,
        transform: `translate(${round(x)} ${round(y)}) rotate(${wobble.turn} ${round(size / 2)} ${round(size / 2)}) scale(${round(scale)})`,
      };
    }),
  );

  const seams = Array.from(
    { length: WIDTH / STRIP_WIDTH - 1 },
    (_, index) => (index + 1) * STRIP_WIDTH,
  );

  return { width: WIDTH, height: HEIGHT, seams, placements };
}

/** The cloth in words, for the live region and the order summary. */
export function describe(pattern: Pattern): string {
  const rows = pattern.rows.map((kind) => motif(kind).plural).join(', ');
  const depth = depthOf(pattern.depth);
  const state = pattern.dyed
    ? `${depth.name.toLowerCase()}, ${depth.dips}`
    : 'stitched, not yet dyed';
  return `${numberWord(pattern.rows.length)} rows: ${rows}. ${pattern.density} motifs per row. ${capitalize(state)}.`;
}

/** The depth's details. */
export function depthOf(depth: IndigoDepth): Depth {
  const found = DEPTHS.find((candidate) => candidate.depth === depth);
  if (!found) {
    throw new Error(`No depth "${depth}".`);
  }
  return found;
}

// A small, repeatable offset from a seed, so the cloth looks hand-made but
// renders the same on the server and in the browser.
function handWobble(seed: number): { dx: number; dy: number; turn: number } {
  const next = (n: number) => {
    const value = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
    return value - Math.floor(value) - 0.5;
  };
  return {
    dx: round(next(1) * 4),
    dy: round(next(2) * 4),
    turn: round(next(3) * 5),
  };
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function numberWord(count: number): string {
  return (
    ['One', 'Two', 'Three', 'Four', 'Five', 'Six'][count - 1] ?? String(count)
  );
}
