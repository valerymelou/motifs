/** The twelve geometric motifs of the series' cloth, one per page. */
export type MotifKind =
  | 'spindle'
  | 'stitch'
  | 'ring'
  | 'seed'
  | 'wave'
  | 'leaf'
  | 'brick'
  | 'zigzag'
  | 'skewer'
  | 'star'
  | 'disc'
  | 'arch';

/**
 * Each motif as one path in a 48 × 48 tile, drawn so the tile repeats
 * seamlessly. Paths fill with even-odd, so rings and slits stay open.
 */
const PATHS: Record<MotifKind, string> = {
  spindle: 'M4 8 24 24 4 40Z M44 8 24 24 44 40Z',
  stitch: 'M2 22h14v4H2Z M32 22h14v4H32Z M22 6h4v12h-4Z M22 30h4v12h-4Z',
  ring: 'M24 8a16 16 0 1 1 0 32 16 16 0 1 1 0-32Z M24 14a10 10 0 1 0 0 20 10 10 0 1 0 0-20Z',
  seed: 'M24 6c9 0 14 8 14 18s-5 18-14 18-14-8-14-18S15 6 24 6Z M23 10c-4 7 4 14 0 28h2c4-14-4-21 0-28Z',
  wave: 'M0 20c8 0 16-8 24-8s16 8 24 8v8c-8 0-16-8-24-8S8 28 0 28Z',
  leaf: 'M0 30 24 10 48 30v8L24 18 0 38Z',
  brick:
    'M4 7h16v12H4Z M28 7h16v12H28Z M-8 31h16v12H-8Z M16 31h16v12H16Z M40 31h16v12H40Z',
  zigzag: 'M0 32 12 16l12 16 12-16 12 16v8L36 24 24 40 12 24 0 40Z',
  skewer: 'M0 23h48v2H0Z M7 14h12v20H7Z M29 14h12v20H29Z',
  star: 'M24 4l5 15 15 5-15 5-5 15-5-15-15-5 15-5Z',
  disc: 'M24 5a19 19 0 1 1 0 38 19 19 0 1 1 0-38Z M24 11a13 13 0 1 0 0 26 13 13 0 1 0 0-26Z M24 13a11 11 0 1 1 0 22 11 11 0 1 1 0-22Z M24 20a4 4 0 1 0 0 8 4 4 0 1 0 0-8Z',
  arch: 'M0 42V16h48v26h-6v-6a18 18 0 0 0-36 0v6Z',
};

/** Which motif stands for which page, from what each brand is about. */
const PAGE_MOTIFS: Record<string, MotifKind> = {
  'atelier-ndop': 'spindle',
  fil: 'stitch',
  njangi: 'ring',
  'bamboutos-coffee': 'seed',
  'lobe-house': 'wave',
  canopee: 'leaf',
  'terre-crue': 'brick',
  'wouri-supply': 'zigzag',
  'soya-nights': 'skewer',
  'ciel-du-nord': 'star',
  'ambiance-records': 'disc',
  'petit-pont': 'arch',
};

/**
 * The motif of a page.
 *
 * @throws When the page has none, so a new page can't ship without one.
 */
export function motifOf(slug: string): MotifKind {
  const motif = PAGE_MOTIFS[slug];
  if (!motif) {
    throw new Error(`No motif for "${slug}".`);
  }
  return motif;
}

/**
 * A motif tile as a CSS image. Elements repeat it as a background, so the
 * page needs no SVG pattern ids that could collide.
 */
export function motifTile(kind: MotifKind, color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="${color}" fill-rule="evenodd" d="${PATHS[kind]}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/** Relative luminance of a `#rrggbb` color, as WCAG defines it. */
export function luminance(hex: string): number {
  const channels = [1, 3, 5].map((start) => {
    const value = parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const [r = 0, g = 0, b = 0] = channels;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two `#rrggbb` colors. */
export function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((light ?? 0) + 0.05) / ((dark ?? 0) + 0.05);
}

const INK = '#0F1326';
const COTTON = '#F4EFE4';

/** The motif color that reads best on a page's accent: ink or cotton. */
export function threadOn(accent: string): string {
  return contrast(accent, INK) >= contrast(accent, COTTON) ? INK : COTTON;
}
