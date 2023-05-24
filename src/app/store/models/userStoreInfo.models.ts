export interface UserStoreInfoModel {
  _id: String;
  phoneNumber: string;
  stores: StoreInfoModel[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface StoreInfoModel {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  role: string;
}
