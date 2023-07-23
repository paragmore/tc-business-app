import {
  ExpenseI,
  PaymentI,
  TransactionI,
} from 'src/app/core/services/transactions/transactions.service';

export interface TransactionsModel {
  transactionsList: Array<TransactionI>;
  paymentsList: Array<PaymentI>;
  selectedTransaction: TransactionI | undefined;
  expensesList: Array<ExpenseI>;
  selectedExpense: ExpenseI | undefined;
}
