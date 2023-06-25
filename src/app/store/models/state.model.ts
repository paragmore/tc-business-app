import { ItemsModel } from './items.model';
import { ScreenModel } from './screen.models';
import { SelectedProductModel } from './selectedProduct.models';
import { UserStoreInfoModel } from './userStoreInfo.models';

export interface AppState {
  readonly screen: ScreenModel;
  readonly userStoreInfo: UserStoreInfoModel;
  readonly selectedProduct: SelectedProductModel;
  readonly items: ItemsModel;
}
