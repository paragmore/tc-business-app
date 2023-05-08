import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'transactions',
    loadComponent: () =>
      import('./pages/transactions/transactions.component').then(
        (m) => m.TransactionsComponent
      ),
  },
  {
    path: 'items',
    loadComponent: () =>
      import('./pages/items/items.component').then(
        (m) => m.ItemsComponent
      ),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'folder/:id',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
  },
  // {
  //   path: '',
  //   loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  // },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
