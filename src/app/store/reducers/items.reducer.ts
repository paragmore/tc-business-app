// import the interface
import { createReducer, on } from '@ngrx/store';
import { setSelectedProduct } from '../actions/selectedProduct.action';
import { ItemsModel } from '../models/items.model';
import {
  setItems,
  setItemsList,
  setSelectedItem,
  updateItemInList,
} from '../actions/items.action';
//create a dummy initial state
const initialState: ItemsModel = {
  selectedItem: undefined,
  itemsList: [],
};

export const itemsReducer = createReducer(
  initialState,
  on(setItemsList, (state, { itemsList }) => ({
    ...state,
    itemsList: itemsList,
  })),
  on(setSelectedItem, (state, { selectedItem }) => ({
    ...state,
    selectedItem: selectedItem,
  })),
  on(setItems, (state, { items }) => ({
    ...items,
  })),
  on(updateItemInList, (state, { item }) => ({
    ...state,
    itemsList: state.itemsList.map((listItem) => {
      if (listItem._id === item._id) {
        return item;
      } else {
        return listItem;
      }
    }),
  }))
);
