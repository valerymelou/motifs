import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { provideLandingMeta } from '@motifs/site';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // The head tags are written into the prerendered HTML, so the browser
    // bundle doesn't need them.
    provideLandingMeta('fil'),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
