import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withNoHttpTransferCache,
} from '@angular/platform-browser';
import { provideNdop } from '@ndop/core';
import { provideIcons } from './lib/icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // These pages make no HTTP requests, so the response cache isn't needed.
    provideClientHydration(withEventReplay(), withNoHttpTransferCache()),
    provideNdop(),
    provideIcons(),
  ],
};
