import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'transactions',
    loadComponent: () =>
      import('./features/transactions/transactions-page/transactions-page').then(
        (m) => m.TransactionsPage,
      ),
  },
  { path: '', redirectTo: 'transactions', pathMatch: 'full' },
];
