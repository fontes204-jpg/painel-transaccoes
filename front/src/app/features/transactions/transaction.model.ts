export type TransactionType = 'CREDIT' | 'DEBIT';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Transaction {
  id: number;
  reference: string;
  description: string;
  amount: number;
  currency: 'AOA' | 'USD' | 'EUR';
  type: TransactionType;
  status: TransactionStatus;
  createdAt: string; // ISO 8601: o JSON não tem Date
}

export interface TransactionFilters {
  search: string;
  status: TransactionStatus | null;
  page: number; // começa em 0
  size: number;
}

export interface PagedResult<T> {
  content: T[];
  totalElements: number;
  page: number;
  size: number;
}
