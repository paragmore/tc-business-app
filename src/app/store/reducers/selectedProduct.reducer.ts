// import the interface
import { createReducer, on } from '@ngrx/store';
import { SelectedProductModel } from '../models/selectedProduct.models';
import { setSelectedProduct } from '../actions/selectedProduct.action';
//create a dummy initial state
const initialState: SelectedProductModel = {
  selectedProductId: '',
};

export const selectedProductReducer = createReducer(
  initialState,
  on(setSelectedProduct, (state, { selectedProduct }) => ({
    ...selectedProduct,
  }))
);
