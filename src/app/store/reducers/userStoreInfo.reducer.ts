// import the interface
import { UserStoreInfoModel } from '../models/userStoreInfo.models';
import {
  setUserStoreInfo,
} from '../actions/userStoreInfo.action';
import { createReducer, on } from '@ngrx/store';
//create a dummy initial state
const initialState: UserStoreInfoModel = {
  __v:0,
  _id:'',
  createdAt:'',
  phoneNumber:'',
  stores:[],
  updatedAt:'',
  defaultStoreId: '',
};

export const userStoreInfoReducer = createReducer(
  initialState,
  on(setUserStoreInfo, (state, {userStoreInfo}) => ({ ...userStoreInfo }))
);
