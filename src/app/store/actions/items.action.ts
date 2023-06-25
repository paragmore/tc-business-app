import { createAction, props } from '@ngrx/store';
import { ProductI } from 'src/app/core/services/products/products.service';
import { ItemsModel } from '../models/items.model';

export enum ItemsActionType {
  UPDATE_SELECTED_ITEM = '[UPDATE_SELECTED_ITEM] Update SelectedItem',
  SET_ITEMS_LIST = '[SET_ITEMS_LIST] Set items list',
  UPDATE_ITEMS = '[UPDATE_ITEMS] Update items',
  UPDATE_ITEM_IN_LIST = '[UPDATE_ITEM_IN_LIST] Update item in list',
}
export const setSelectedItem = createAction(
  ItemsActionType.UPDATE_SELECTED_ITEM,
  props<{ selectedItem: ProductI | undefined }>()
);

export const setItemsList = createAction(
  ItemsActionType.SET_ITEMS_LIST,
  props<{ itemsList: Array<ProductI> }>()
);

export const setItems = createAction(
  ItemsActionType.UPDATE_ITEMS,
  props<{ items: ItemsModel }>()
);

export const updateItemInList = createAction(
  ItemsActionType.UPDATE_ITEM_IN_LIST,
  props<{ item: ProductI }>()
);
