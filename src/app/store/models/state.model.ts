import { ItemsModel } from './items.model';
import { PartiesModel } from './parties.model';
import { ScreenModel } from './screen.models';
import { SelectedProductModel } from './selectedProduct.models';
import { TransactionsModel } from './transactions.model';
import { UserStoreInfoModel } from './userStoreInfo.models';

export interface AppState {
  readonly screen: ScreenModel;
  readonly userStoreInfo: UserStoreInfoModel;
  readonly selectedProduct: SelectedProductModel;
  readonly items: ItemsModel;
  readonly parties: PartiesModel;
  readonly transactions: TransactionsModel;
}
