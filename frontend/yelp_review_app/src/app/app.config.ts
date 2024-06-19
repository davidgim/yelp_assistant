import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { provideAuth0 } from '@auth0/auth0-angular';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const domain = 'dev-crwti8zu1cnqknlp.us.auth0.com';
const clientId = 'QRPObLEZnBMRaCXoJchOTd1wSQVRXnmz';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    provideAnimationsAsync(),
    provideHttpClient(),
    provideAuth0({
      domain: domain,
      clientId: clientId,
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
    importProvidersFrom(
      FormsModule,
      MatToolbarModule,
      MatFormFieldModule,
      MatInputModule,
      MatListModule,
      MatDialogModule,
      MatAutocompleteModule,
      MatButtonModule
    )
  ]
};
