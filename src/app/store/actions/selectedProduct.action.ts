import { createAction, props } from '@ngrx/store';
import { SelectedProductModel } from '../models/selectedProduct.models';

export enum SelectedProductType {
  UPDATE_SELECTED_PRODUCT = '[SELECTED_PRODUCT] Update SelectedProduct',
}
export const setSelectedProduct = createAction(
  SelectedProductType.UPDATE_SELECTED_PRODUCT,
  props<{ selectedProduct: SelectedProductModel }>()
);
