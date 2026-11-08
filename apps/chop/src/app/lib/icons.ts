import { type EnvironmentProviders } from '@angular/core';
import { provideNdopIcons, type NdIcons } from '@ndop/core';

/**
 * Icons styled items ask for by semantic name, drawn with Lucide
 * (ADR-0013). Add an entry when you install an item that needs a new name;
 * to switch icon libraries, change the values here.
 *
 * Only the icons this page draws, instead of Ndop's default 65: the
 * chevrons of the Select and the FAQ, the Select's check, and the phone
 * on the store buttons. They're
 * Lucide's (ISC), written out in the node format Ndop reads: importing
 * them from `@lucide/angular` brings Lucide's Angular component along,
 * about 3 kB gzip.
 */
export const ndopIcons = {
  'chevron-down': { node: [['path', { d: 'm6 9 6 6 6-6' }]] },
  check: { node: [['path', { d: 'M20 6 9 17l-5-5' }]] },
  smartphone: {
    node: [
      ['rect', { width: '14', height: '20', x: '5', y: '2', rx: '2', ry: '2' }],
      ['path', { d: 'M12 18h.01' }],
    ],
  },
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
