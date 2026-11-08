import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideClientHydration,
  withIncrementalHydration,
  withNoHttpTransferCache,
} from '@angular/platform-browser';
import { provideNdop } from '@ndop/core';
import { provideIcons } from './lib/icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // These pages make no HTTP requests, so the response cache isn't needed.
    // Incremental hydration lets the sections below the fold wait for the
    // viewport (app.html); it replays events too, like withEventReplay.
    provideClientHydration(
      withIncrementalHydration(),
      withNoHttpTransferCache(),
    ),
    provideNdop(),
    provideIcons(),
  ],
};
