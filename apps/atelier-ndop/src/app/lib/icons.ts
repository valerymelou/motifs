import { type EnvironmentProviders } from '@angular/core';
import { provideNdopIcons, type NdIcons } from '@ndop/core';

/**
 * Icons styled items ask for by semantic name, drawn with Lucide
 * (ADR-0013). Add an entry when you install an item that needs a new name;
 * to switch icon libraries, change the values here.
 *
 * Only the dialog's close button draws an icon here, so the map holds that
 * one instead of Ndop's default 65. It's Lucide's `x` (ISC), written out in
 * the node format Ndop reads: importing it from `@lucide/angular` brings
 * Lucide's Angular component along, about 3 kB gzip for two lines.
 */
export const ndopIcons = {
  x: {
    node: [
      ['path', { d: 'M18 6 6 18' }],
      ['path', { d: 'm6 6 12 12' }],
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
