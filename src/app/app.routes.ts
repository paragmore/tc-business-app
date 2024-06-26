import { Routes } from '@angular/router';
import { AuthGuard } from './core/services/auth/auth.guard.service';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  {
    path: 'reports',
    loadComponent: () =>
      import('./pages/reports/reports-page/reports-page.component').then(
        (m) => m.ReportsPageComponent
      ),
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'parties',
    loadComponent: () =>
      import('./pages/parties/parties.component').then(
        (m) => m.PartiesComponent
      ),
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'party/:id',
    loadComponent: () =>
      import(
        './pages/customers/customer-details/customer-details.component'
      ).then((m) => m.CustomerDetailsComponent),
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'parties/:id',
    loadComponent: () =>
      import('./pages/parties/parties.component').then(
        (m) => m.PartiesComponent
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
    path: 'transaction/:id',
    loadComponent: () =>
      import(
        './pages/transactions/transaction-details/transaction-details.component'
      ).then((m) => m.TransactionDetailsComponent),
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'transactions/:id',
    loadComponent: () =>
      import('./pages/transactions/transactions.component').then(
        (m) => m.TransactionsComponent
      ),
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'payments/create',
    loadComponent: () =>
      import(
        './pages/payments/payment-creation-form/payment-creation-form.component'
      ).then((m) => m.PaymentCreationFormComponent),
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'payments',
    loadComponent: () =>
      import('./pages/payments/payments.component').then(
        (m) => m.PaymentsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'payment/:id',
    loadComponent: () =>
      import('./pages/payments/payment-details/payment-details.component').then(
        (m) => m.PaymentDetailsComponent
      ),
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'payments/:id',
    loadComponent: () =>
      import('./pages/payments/payments.component').then(
        (m) => m.PaymentsComponent
      ),
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'item/:id',
    loadComponent: () =>
      import(
        './pages/items/item-details-page/item-details-page.component'
      ).then((m) => m.ItemDetailsPageComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'items/:id',
    loadComponent: () =>
      import('./pages/items/items.component').then((m) => m.ItemsComponent),
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
