import { createAction, props } from '@ngrx/store';
import { TransactionsModel } from '../models/transactions.model';
import { TransactionI } from 'src/app/core/services/transactions/transactions.service';

export enum TransactionsActionType {
  UPDATE_SELECTED_TRANSACTION = '[UPDATE_SELECTED_TRANSACTION] Update SelectedTransaction',
  SET_TRANSACTION_LIST = '[SET_TRANSACTION_LIST] Set transactions list',
  UPDATE_TRANSACTION = '[UPDATE_TRANSACTION] Update transactions',
  UPDATE_TRANSACTION_IN_LIST = '[UPDATE_TRANSACTION_IN_LIST] Update transaction in list',
  DELETE_TRANSACTION_IN_LIST = '[DELETE_TRANSACTION_IN_LIST] Delete transaction in list',
}
export const setSelectedTransaction = createAction(
  TransactionsActionType.UPDATE_SELECTED_TRANSACTION,
  props<{ selectedTransaction: TransactionI | undefined }>()
);

export const setTransactionsList = createAction(
  TransactionsActionType.SET_TRANSACTION_LIST,
  props<{ transactionsList: Array<TransactionI> }>()
);

export const setTransactions = createAction(
  TransactionsActionType.UPDATE_TRANSACTION,
  props<{ transactions: TransactionsModel }>()
);

export const updateTransactionInList = createAction(
  TransactionsActionType.UPDATE_TRANSACTION_IN_LIST,
  props<{ transaction: TransactionI }>()
);

export const deleteTransactionInList = createAction(
  TransactionsActionType.DELETE_TRANSACTION_IN_LIST,
  props<{ transaction: string }>()
);
