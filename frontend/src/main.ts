import { bootstrapApplication } from '@angular/platform-browser';
import { provideAuth0 } from '@auth0/auth0-angular';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    importProvidersFrom(HttpClientModule),
    provideAuth0({
      domain: 'dev-yli5pgugc5b5yryw.us.auth0.com',
      clientId: 'yMu3l6DXczkY56CFFPOJhLpm1ZvK61sW',
      authorizationParams: {
        redirect_uri: window.location.origin + '/callback',
        audience: 'https://dev-yli5pgugc5b5yryw.us.auth0.com/api/v2/', // Ajuste para o seu domínio
        
      },
      cacheLocation: 'localstorage',
      useRefreshTokens: true
    })
  ],
});