import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('../pages/transactions/transactions.component').then((m) => m.TransactionsComponent),
      },
      {
        path: 'collections',
        loadComponent: () =>
          import('../pages/collections/collections.component').then((m) => m.CollectionsComponent),
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
