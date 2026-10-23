import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideLandingMeta } from '@motifs/site';
import { provideNdop } from '@ndop/core';
import { provideIcons } from './lib/icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideNdop(),
    provideIcons(),
    provideLandingMeta(),
  ],
};
