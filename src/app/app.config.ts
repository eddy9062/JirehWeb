import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import localeEsGt from '@angular/common/locales/es-GT';
import { registerLocaleData } from '@angular/common';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

registerLocaleData(localeEsGt, 'es-GT');

export const appConfig: ApplicationConfig = {

providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    { provide: LOCALE_ID, useValue: 'es-GT' }
  ],
};
