// import the interface
import { createReducer, on } from '@ngrx/store';
import { setSelectedProduct } from '../actions/selectedProduct.action';
import { PartiesModel } from '../models/parties.model';
import {
  deletePartyInList,
  setParties,
  setPartiesList,
  setSelectedParty,
  updatePartyInList,
} from '../actions/parties.action';
import {
  GetAllCustomersResponseI,
  SupplierI,
} from 'src/app/core/services/parties/parties.service';
//create a dummy initial state
const initialState: PartiesModel = {
  selectedParty: undefined,
  partiesList: [],
};

export const partiesReducer = createReducer(
  initialState,
  on(setPartiesList, (state, { partiesList }) => ({
    ...state,
    partiesList: partiesList,
  })),
  on(setSelectedParty, (state, { selectedParty }) => {
    console.log(selectedParty, 'in update');

    return { ...state, selectedParty: selectedParty };
  }),
  on(setParties, (state, { parties }) => ({
    ...parties,
  })),
  on(updatePartyInList, (state, { party }) => {
    return {
      ...state,
      partiesList: state.partiesList.map((listParty) => {
        if ('customer' in listParty && 'customer' in party) {
          if (listParty.customer._id === party.customer._id) {
            return party;
          } else {
            return listParty;
          }
        }
        if ('_id' in listParty && '_id' in party) {
          if (listParty._id === party._id) {
            return party;
          } else {
            return listParty;
          }
        }
        return listParty;
      }),
    };
  }),
  on(deletePartyInList, (state, { party }) => ({
    ...state,
    partiesList: deletePartyInListFn(state.partiesList, party),
  }))
);

function deletePartyInListFn(
  partiesList: Array<GetAllCustomersResponseI | SupplierI>,
  party: GetAllCustomersResponseI | SupplierI
) {
  const deleteIndex = partiesList.findIndex((listParty) => {
    if ('customer' in listParty && 'customer' in party) {
      return listParty.customer._id === party.customer._id;
    } else if ('_id' in listParty && '_id' in party) {
      return listParty._id === party._id;
    } else {
      return false;
    }
  });
  if (deleteIndex) {
    partiesList.splice(deleteIndex, 1);
  }
  return partiesList;
}
