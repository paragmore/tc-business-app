// import the interface
import { createReducer, on } from '@ngrx/store';
import { setSelectedProduct } from '../actions/selectedProduct.action';
import { TransactionsModel } from '../models/transactions.model';
import {
  deleteTransactionInList,
  setTransactions,
  setTransactionsList,
  setSelectedTransaction,
  updateTransactionInList,
  setExpensesList,
  setSelectedExpense,
  updateExpenseInList,
  deleteExpenseInList,
} from '../actions/transactions.action';
import {
  ExpenseI,
  TransactionI,
} from 'src/app/core/services/transactions/transactions.service';
//create a dummy initial state
const initialState: TransactionsModel = {
  selectedTransaction: undefined,
  transactionsList: [],
  expensesList: [],
  selectedExpense: undefined,
};

export const transactionsReducer = createReducer(
  initialState,
  on(setTransactionsList, (state, { transactionsList }) => ({
    ...state,
    transactionsList: transactionsList,
  })),
  on(setSelectedTransaction, (state, { selectedTransaction }) => {
    console.log(selectedTransaction, 'in update');

    return { ...state, selectedTransaction: selectedTransaction };
  }),
  on(setTransactions, (state, { transactions }) => ({
    ...transactions,
  })),
  on(updateTransactionInList, (state, { transaction }) => {
    return {
      ...state,
      transactionsList: state.transactionsList.map((listTransaction) => {
        if (listTransaction._id === transaction._id) {
          return transaction;
        } else {
          return listTransaction;
        }
      }),
    };
  }),
  on(deleteTransactionInList, (state, { transaction }) => ({
    ...state,
    transactionsList: deleteTransactionInListFn(
      state.transactionsList,
      transaction
    ),
  })),
  on(setExpensesList, (state, { expensesList }) => ({
    ...state,
    expensesList: expensesList,
  })),
  on(setSelectedExpense, (state, { selectedExpense }) => {
    console.log(selectedExpense, 'in update');

    return { ...state, selectedExpense: selectedExpense };
  }),
  on(updateExpenseInList, (state, { expense }) => {
    return {
      ...state,
      expensesList: state.expensesList.map((listExpense) => {
        if (listExpense._id === expense._id) {
          return expense;
        } else {
          return listExpense;
        }
      }),
    };
  }),
  on(deleteExpenseInList, (state, { expense }) => ({
    ...state,
    expensesList: deleteExpenseInListFn(state.expensesList, expense),
  }))
);

function deleteExpenseInListFn(expensesList: Array<ExpenseI>, expense: string) {
  const deleteIndex = expensesList.findIndex((listTransaction) => {
    if ('_id' in listTransaction) {
      return listTransaction._id === expense;
    } else {
      return false;
    }
  });
  if (deleteIndex) {
    expensesList.splice(deleteIndex, 1);
  }
  return expensesList;
}

function deleteTransactionInListFn(
  transactionsList: Array<TransactionI>,
  transaction: string
) {
  const deleteIndex = transactionsList.findIndex((listTransaction) => {
    if ('_id' in listTransaction) {
      return listTransaction._id === transaction;
    } else {
      return false;
    }
  });
  if (deleteIndex) {
    transactionsList.splice(deleteIndex, 1);
  }
  return transactionsList;
}
