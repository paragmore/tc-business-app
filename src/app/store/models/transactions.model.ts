import { TransactionI } from 'src/app/core/services/transactions/transactions.service';

export interface TransactionsModel {
  transactionsList: Array<TransactionI>;
  selectedTransaction: TransactionI | undefined;
}
