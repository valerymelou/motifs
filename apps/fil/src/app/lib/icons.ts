import { type EnvironmentProviders } from '@angular/core';
import { provideNdopIcons, type NdIcons } from '@ndop/core';

/**
 * Icons styled items ask for by semantic name, drawn with Lucide
 * (ADR-0013). Add an entry when you install an item that needs a new name;
 * to switch icon libraries, change the values here.
 *
 * Only the icons this page draws, instead of Ndop's default 65: the
 * dialog's close button, the palette's search field, the FAQ's chevrons and
 * the samples' copy buttons. They're Lucide's (ISC), written out in the
 * node format Ndop reads: importing them from `@lucide/angular` brings
 * Lucide's Angular component along, about 3 kB gzip.
 */
export const ndopIcons = {
  x: {
    node: [
      ['path', { d: 'M18 6 6 18' }],
      ['path', { d: 'm6 6 12 12' }],
    ],
  },
  search: {
    node: [
      ['path', { d: 'm21 21-4.34-4.34' }],
      ['circle', { cx: '11', cy: '11', r: '8' }],
    ],
  },
  'chevron-down': { node: [['path', { d: 'm6 9 6 6 6-6' }]] },
  copy: {
    node: [
      ['rect', { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2' }],
      [
        'path',
        { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' },
      ],
    ],
  },
  check: { node: [['path', { d: 'M20 6 9 17l-5-5' }]] },
} satisfies NdIcons;

/**
 * Registers {@link ndopIcons}. `ndop init` adds it to the providers in
 * `app.config.ts`.
 *
 * @returns Providers for `ApplicationConfig`.
 *
 * @example
 * ```ts
 * providers: [provideNdop(), provideIcons()];
 * ```
 */
export function provideIcons(): EnvironmentProviders {
  return provideNdopIcons(ndopIcons);
}
