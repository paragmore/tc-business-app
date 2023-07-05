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
} from '../actions/transactions.action';
import { TransactionI } from 'src/app/core/services/transactions/transactions.service';
//create a dummy initial state
const initialState: TransactionsModel = {
  selectedTransaction: undefined,
  transactionsList: [],
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
  }))
);

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
