import { ScreenModel } from './screen.models';
import { UserStoreInfoModel } from './userStoreInfo.models';

export interface AppState {
  readonly screen: ScreenModel;
  readonly userStoreInfo: UserStoreInfoModel
}
