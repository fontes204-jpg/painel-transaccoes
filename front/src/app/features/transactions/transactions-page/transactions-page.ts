import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { TransactionsService } from '../transactions.service';
import { PagedResult, Transaction } from '../transaction.model';

type ListState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'success'; data: PagedResult<Transaction> };

@Component({
  selector: 'app-transactions-page',
  imports: [DecimalPipe],
  templateUrl: './transactions-page.html',
  styleUrl: './transactions-page.scss',
})
export class TransactionsPage {
  private readonly service = inject(TransactionsService);

  protected readonly search = signal('');

  private readonly state = toSignal(
    toObservable(this.search).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) =>
        this.service.list({ search: term, status: null, page: 0, size: 10 }).pipe(
          map((data): ListState => ({ kind: 'success', data })),
          startWith({ kind: 'loading' } as ListState),
          catchError(() =>
            of({ kind: 'error', message: 'Não foi possível carregar as transações.' } as ListState),
          ),
        ),
      ),
    ),
    { initialValue: { kind: 'loading' } as ListState },
  );

  protected readonly loading = computed(() => {
    const s = this.state();
    return s.kind === 'loading' ? true : false;
  });

  protected readonly errorMessage = computed(() => {
    const s = this.state();
    return s.kind === 'error' ? s.message : null;
  });

  protected readonly transactions = computed(() => {
    const s = this.state();
    return s.kind === 'success' ? s.data.content : [];
  });

  protected readonly total = computed(() => {
    const s = this.state();
    return s.kind === 'success' ? s.data.totalElements : 0;
  });

  private readonly result = toSignal(
    toObservable(this.search).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap((term) => console.log('pedido:', term)),
      switchMap((term) => this.service.list({ search: term, status: null, page: 0, size: 10 })),
    ),
  );

  protected onSearch(event: Event) {
    this.search.set((event.target as HTMLInputElement).value);
  }
}
