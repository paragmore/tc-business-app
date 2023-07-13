import {
  ExpenseI,
  TransactionI,
} from 'src/app/core/services/transactions/transactions.service';

export interface TransactionsModel {
  transactionsList: Array<TransactionI>;
  selectedTransaction: TransactionI | undefined;
  expensesList: Array<ExpenseI>;
  selectedExpense: ExpenseI | undefined;
}
