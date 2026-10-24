import { isPlatformBrowser } from '@angular/common';
import {
  type ApplicationConfig,
  inject,
  PLATFORM_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withNoHttpTransferCache,
} from '@angular/platform-browser';
import { provideNdop } from '@ndop/core';
import { provideIcons } from './lib/icons';
import { ThemeChoice } from './theme/theme-choice';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // These pages make no HTTP requests, so the response cache isn't needed.
    provideClientHydration(withEventReplay(), withNoHttpTransferCache()),
    provideNdop(),
    provideIcons(),
    // Ndop starts in system mode; hand it the visitor's remembered theme.
    provideAppInitializer(() => {
      if (isPlatformBrowser(inject(PLATFORM_ID))) {
        inject(ThemeChoice).restore();
      }
    }),
  ],
};
