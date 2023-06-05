import { Routes } from '@angular/router';
import { AuthGuard } from './core/services/auth/auth.guard.service';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  {
    path: 'customers',
    loadComponent: () =>
      import('./pages/customers/customers.component').then(
        (m) => m.CustomersComponent
      ),
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'transactions/create',
    loadComponent: () =>
      import(
        './pages/transactions/transaction-creation-form/transaction-creation-form.component'
      ).then((m) => m.TransactionCreationFormComponent),
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./pages/transactions/transactions.component').then(
        (m) => m.TransactionsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'items/:id',
    loadComponent: () =>
      import(
        './pages/items/item-details-page/item-details-page.component'
      ).then((m) => m.ItemDetailsPageComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'items',
    loadComponent: () =>
      import('./pages/items/items.component').then((m) => m.ItemsComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'folder/:id',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
    canActivate: [AuthGuard],
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
  {
    path: 'login',
    component: LoginComponent,
    // canActivate:[AuthGuard]
  },
];
