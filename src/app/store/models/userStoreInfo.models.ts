export interface UserStoreInfoModel {
  _id: String;
  phoneNumber: string;
  stores: StoreInfoModel[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  currentStoreId?: string;
  defaultStoreId: string;
  name?: string;
  photoUrl?: string;
}

export interface StoreInfoModel {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  role: string;
  name?: string;
  logoUrl?: string;
  businessType?: string;
  businessDomain?: string;
  gstNumber?: string;
  allowCreditReportAccess?: boolean;
  onlineStoreLive?: boolean;
  plan?: string;
  address?: {
    city?: string;
    state?: string;
    firstLine?: string;
    secondLine?: string;
    pinCode?: string;
    district?: string;
  };
  location?: string;
  companyType?: string;
  phoneNumber: string;
  lastInvoiceInfo: {
    sequence: string;
    invoiceId: number;
  };
}
