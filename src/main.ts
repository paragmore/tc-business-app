import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { StoreModule } from '@ngrx/store';
import { screenReducer } from './app/store/reducers/screen.reducer';
import { HttpClientModule } from '@angular/common/http';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { userStoreInfoReducer } from './app/store/reducers/userStoreInfo.reducer';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { selectedProductReducer } from './app/store/reducers/selectedProduct.reducer';
import { itemsReducer } from './app/store/reducers/items.reducer';
import { partiesReducer } from './app/store/reducers/parties.reducer';
import { transactionsReducer } from './app/store/reducers/transactions.reducer';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({})),
    provideRouter(routes),
    importProvidersFrom(
      StoreModule.forRoot({
        screen: screenReducer,
        userStoreInfo: userStoreInfoReducer,
        selectedProduct: selectedProductReducer,
        items: itemsReducer,
        parties: partiesReducer,
        transactions: transactionsReducer,
      })
    ),
    importProvidersFrom(HttpClientModule),
    provideStoreDevtools(),
  ],
});

defineCustomElements(window);
