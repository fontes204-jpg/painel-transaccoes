import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import {
  PagedResult,
  Transaction,
  TransactionFilters,
  TransactionStatus,
} from './transaction.model';

const DESCRIPTIONS = [
  'Transferência recebida',
  'Pagamentos de serviços',
  'Levantamento ATM',
  'Compra POS',
  'Salário',
];
const STATUSES: TransactionStatus[] = ['PENDING', 'COMPLETED', 'FAILED'];

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private readonly all: Transaction[] = Array.from({ length: 45 }, (_, i): Transaction => ({
    id: i + 1,
    reference: `TRX-${String(i + 1).padStart(5, '0')}`,
    description: DESCRIPTIONS[i % DESCRIPTIONS.length],
    amount: (i + 1) * 1500,
    currency: 'AOA',
    type: i % 3 === 0 ? 'CREDIT' : 'DEBIT',
    status: STATUSES[i % STATUSES.length],
    createdAt: new Date(2026, 10, 1 + (i % 28)).toISOString(),
  }));

  list(filters: TransactionFilters): Observable<PagedResult<Transaction>> {
    const term = filters.search.trim().toLowerCase();

    const filtered = this.all.filter((t) => {
      const matchesSearch =
        !term ||
        t.description.toLowerCase().includes(term) ||
        t.reference.toLocaleLowerCase().includes(term);
      const matchesStatus = !filters.status || t.status === filters.status;
      return matchesSearch && matchesStatus;
    });

    const start = filters.page * filters.size;

    return of({
      content: filtered.slice(start, start + filters.size),
      totalElements: filtered.length,
      page: filters.page,
      size: filters.size,
    }).pipe(delay(400));
  }
}
