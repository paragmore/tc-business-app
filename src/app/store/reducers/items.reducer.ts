// import the interface
import { createReducer, on } from '@ngrx/store';
import { setSelectedProduct } from '../actions/selectedProduct.action';
import { ItemsModel } from '../models/items.model';
import {
  deleteItemInList,
  setItems,
  setItemsList,
  setSelectedItem,
  updateItemInList,
} from '../actions/items.action';
import { ProductI } from 'src/app/core/services/products/products.service';
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
  })),
  on(deleteItemInList, (state, { item }) => ({
    ...state,
    itemsList: deleteItemInListFn(state.itemsList, item),
  }))
);

function deleteItemInListFn(itemsList: Array<ProductI>, item: ProductI) {
  const deleteIndex = itemsList.findIndex(
    (listItem) => listItem._id === item._id
  );
  if (deleteIndex) {
    itemsList.splice(deleteIndex, 1);
  }
  return itemsList;
}
