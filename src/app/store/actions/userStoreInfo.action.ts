import { createAction, props } from '@ngrx/store';
import { UserStoreInfoModel } from '../models/userStoreInfo.models';

export enum UserStoreInfoActionType {
  UPDATE_USER_STORE_INFO = '[USER_STORE_INFO] Update User store info',
}
export const setUserStoreInfo = createAction(
  UserStoreInfoActionType.UPDATE_USER_STORE_INFO,
  props<{ userStoreInfo: UserStoreInfoModel }>()
);
