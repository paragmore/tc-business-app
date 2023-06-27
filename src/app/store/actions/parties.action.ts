import { createAction, props } from '@ngrx/store';
import { PartiesModel } from '../models/parties.model';
import {
  GetAllCustomersResponseI,
  SupplierI,
} from 'src/app/core/services/parties/parties.service';

export enum PartiesActionType {
  UPDATE_SELECTED_PARTY = '[UPDATE_SELECTED_PARTY] Update SelectedParty',
  SET_PARTIES_LIST = '[SET_PARTIES_LIST] Set parties list',
  UPDATE_PARTIES = '[UPDATE_PARTIES] Update parties',
  UPDATE_PARTY_IN_LIST = '[UPDATE_PARTY_IN_LIST] Update party in list',
  DELETE_PARTY_IN_LIST = '[DELETE_PARTY_IN_LIST] Delete party in list',
}
export const setSelectedParty = createAction(
  PartiesActionType.UPDATE_SELECTED_PARTY,
  props<{ selectedParty: GetAllCustomersResponseI | SupplierI | undefined }>()
);

export const setPartiesList = createAction(
  PartiesActionType.SET_PARTIES_LIST,
  props<{ partiesList: Array<GetAllCustomersResponseI | SupplierI> }>()
);

export const setParties = createAction(
  PartiesActionType.UPDATE_PARTIES,
  props<{ parties: PartiesModel }>()
);

export const updatePartyInList = createAction(
  PartiesActionType.UPDATE_PARTY_IN_LIST,
  props<{ party: GetAllCustomersResponseI | SupplierI }>()
);

export const deletePartyInList = createAction(
  PartiesActionType.DELETE_PARTY_IN_LIST,
  props<{ party: string }>()
);
