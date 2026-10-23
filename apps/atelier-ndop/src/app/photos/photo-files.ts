import { PHOTOS } from './manifest';

/** The file the images target made for a photo at one of its widths. */
export function photoFile(name: string, width: number): string {
  return `images/${name}-${width}.webp`;
}

/** Every width of a photo, for `srcset`; empty until the photo exists. */
export function photoSrcset(name: string): string {
  return (PHOTOS[name]?.widths ?? [])
    .map((width) => `${photoFile(name, width)} ${width}w`)
    .join(', ');
}

/** The largest file, for browsers that ignore `srcset`. */
export function photoFallback(name: string): string | undefined {
  const widths = PHOTOS[name]?.widths ?? [];
  const largest = widths[widths.length - 1];
  return largest === undefined ? undefined : photoFile(name, largest);
}
