import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAuthHeaders } from '../../utils/authHeaders';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  constructor(private httpClient: HttpClient) {}
  baseUrl = false
    ? 'https://transactions-api.taxpayercorner.com'
    : 'http://localhost:8030';

  createStoreCategory(createCategoryRequest: CreateCategoryRequestI) {
    const url = `${this.baseUrl}/transactions/category/create`;
    console.log(url);
    const headers = getAuthHeaders();
    const body = {
      ...createCategoryRequest,
    };
    return this.httpClient.post(url, body, { headers: headers });
  }

  createStoreTransaction(createTransactionRequest: CreateTransactionRequestI) {
    const url = `${this.baseUrl}/transactions/create`;
    const headers = getAuthHeaders();
    const body = {
      ...createTransactionRequest,
    };
    return this.httpClient.post(url, body, { headers: headers });
  }

  // bulkTransactionsUpload(bulkTransactionsUploadRequest: BulkTransactionsUploadRequestI) {
  //   const url = `${this.baseUrl}/transactions/bulk/create`;
  //   const headers = getAuthHeaders();
  //   const body = {
  //     ...bulkTransactionsUploadRequest,
  //   };
  //   return this.httpClient.post(url, body, { headers: headers });
  // }

  // updateStoreTransaction(createTransactionRequest: UpdateTransactionRequestI) {
  //   const url = `${this.baseUrl}/transactions/update`;
  //   const headers = getAuthHeaders();
  //   const body = {
  //     ...createTransactionRequest,
  //   };
  //   return this.httpClient.put(url, body, { headers: headers });
  // }

  getStoreTransactionById(storeId: string, transactionId: string) {
    const url = `${this.baseUrl}/transactions/${storeId}/${transactionId}`;
    const headers = getAuthHeaders();
    return this.httpClient.get(url, { headers: headers });
  }
  getAllStoreTransactions(
    storeId: string,
    options?: GetTransactionsQueryParamsI
  ) {
    const queryParams = new URLSearchParams();
    if (options?.pageSize) {
      queryParams.append('pageSize', options.pageSize);
    }
    if (options?.page) {
      queryParams.append('page', options.page);
    }
    if (options?.sortBy) {
      queryParams.append('sortBy', options.sortBy);
    }
    if (options?.sortOrder) {
      queryParams.append('sortOrder', options.sortOrder);
    }
    const url = `${
      this.baseUrl
    }/transactions/${storeId}?${queryParams.toString()}`;
    const headers = getAuthHeaders();
    return this.httpClient.get(url, { headers: headers });
  }

  deleteStoreTransactions(storeId: string, transactionIds: string[]) {
    const url = `${this.baseUrl}/transactions/delete`;
    const headers = getAuthHeaders();
    const body = {
      storeId,
      transactionIds,
    };
    return this.httpClient.post(url, body, { headers: headers });
  }
}
interface VariantPropertiesI {
  [key: string]: string;
}

interface VariantI {
  properties: VariantPropertiesI;
  stockQuantity: number;
  sellsPrice?: number;
  skuId?: number;
  discounts?: DiscountI[];
  imageUrls?: string[];
}

interface UnitI {
  quantity?: number;
  name: string;
  conversion?: number;
}
interface TransactionI {
  _id: string;
  storeId: string;
  transactionType: string;
  invoiceId: string;
  date: Date;
  dueDate: Date;
  party: TransactionPartyI;
  additionalFields: AdditionalFieldI[];
  items: TransactionItemI[];
  stateOfSupply: string;
  customerNotes?: string;
  termsAndConditions?: string;
  payments: string[];
  paymentStatus: string;
  totalInformation: {
    subTotal: number;
    gst?: number;
    cess?: number;
    discounts?: number;
    total: number;
  };
}

export enum TaxPreferenceEnum {
  TAXABLE = 'Taxable',
  NON_TAXABLE = 'Non-Taxable',
  NON_GST_SUPPLY = 'Non GST Supply',
  NIL_RATED = 'Nil Rated',
  EXEMPT = 'Exempt',
}

export interface TransactionsAccountInterfaceI {
  sales: string;
  purchase: string;
}

export interface InventoryTransactionI {
  transactionId: string;
  amountConsumed: number;
}

interface TransactionDocument extends Document, TransactionI {}

export {
  VariantPropertiesI,
  VariantI,
  UnitI,
  TransactionI,
  TransactionDocument,
};

export interface CategoryI {
  name: string;
  description: string;
  storeId: string;
  slug?: string;
}

export interface CreateCategoryRequestI extends CategoryI {}

export interface AdditionalFieldI {
  key: string;
  value: string;
}
export interface UpdateTransactionRequestI {
  transactionId: string;
  name: string;
  description?: string;
  sellsPrice: number;
  purchasePrice?: number;
  category: string[];
  variants?: VariantI[];
  heroImage?: string;
  images?: string[];
  quantity: number;
  discounts?: DiscountI[];
  hsnCode?: string;
  taxIncluded?: boolean;
  unit: string;
  purchaseUnitName?: string;
  purchaseUnitConversion?: number;
  gstPercentage?: number;
  cess?: number;
  deliveryTime?: string;
  isInventory?: boolean;
  inventoryTransactions?: InventoryTransactionI[];
  lowStock?: number;
  margin?: number;
  asPerMargin: boolean;
  account: TransactionsAccountInterfaceI;
  additionalFields?: AdditionalFieldI[];
  taxPreference: TaxPreferenceEnum;
}

export interface TransactionPartyI {
  partyId?: string;
  name: string;
  phoneNumber: string;
  tradeName?: string;
  email?: string;
  gstin?: string;
  address?: AddressesI;
}

export interface AddressI {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pinCode: string;
}
export interface AddressesI {
  shipping: AddressI;
  billingSameAsShipping: boolean;
  billing?: AddressI;
  name?: string;
  phoneNumber?: string;
  type?: string;
}

export interface AdditionalFieldI {
  key: string;
  value: string;
}

export interface DiscountI {
  discountId?: string;
  code: string;
  value: number;
  minimum: number;
  type: 'percentage' | 'amount';
  minType: 'orderQuantity' | 'orderValue';
  maxDiscount?: number;
}

export enum PaymentStatusEnum {
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY PAID',
  UNPAID = 'UNPAID',
}
export interface TransactionItemI {
  itemName: string;
  itemId?: string;
  quantity: number;
  sellsPrice: number;
  discount?: DiscountI;
  gstPercentage: number;
  taxIncluded: boolean;
  cess: number;
  amount: number;
}

export interface CreateTransactionRequestI {
  storeId: string;
  transactionType: string;
  invoiceId: string;
  date: Date;
  dueDate: Date;
  party: TransactionPartyI;
  additionalFields: AdditionalFieldI[];
  items: TransactionItemI[];
  stateOfSupply: string;
  customerNotes?: string;
  termsAndConditions?: string;
  paymentDone?: {
    mode: string;
    amount: number;
  };
}

export interface BulkTransactionUploadSingleRequestI {
  name: string;
  description?: string;
  sellsPrice: number;
  purchasePrice?: number;
  category?: string[];
  variants?: VariantI[];
  heroImage?: string;
  images?: string[];
  quantity: number;
  discounts?: DiscountI[];
  hsnCode?: string;
  taxIncluded?: boolean;
  unit: string;
  purchaseUnitName?: string;
  purchaseUnitConversion?: number;
  gstPercentage?: number;
  deliveryTime?: string;
  isInventory?: boolean;
  inventoryTransactions?: InventoryTransactionI[];
  lowStock?: number;
  isService: boolean;
  margin?: number;
  asPerMargin: boolean;
  cess?: number;
  taxPreference: TaxPreferenceEnum;
}

export interface TransactionsFilterByI {}

export interface TransactionsFilterByQueryI {
  category?: string;
  minSellsPrice?: number;
  maxSellsPrice?: number;
  minPurchasePrice?: number;
  maxPurchasePrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
  itemType?: ItemTypeEnum;
}

export enum ItemTypeEnum {
  PRODUCT = 'Transaction',
  SERVICE = 'Service',
}

export interface SortI {
  sortBy: string | undefined;
  sortOrder: SortOrder | undefined;
}
export interface GetTransactionsQueryParamsI
  extends TransactionsFilterByQueryI,
    PaginationQueryParamsI {}

export interface PaginationQueryParamsI {
  pageSize?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export type SortOrder = 'asc' | 'desc' | '1' | '-1' | 'ascending' | 'decending';

export interface DeleteTransactionsRequestI {
  storeId: string;
  transactionIds: string[];
}

export interface BulkTransactionsUploadRequestI {
  storeId: string;
  transactions: BulkTransactionUploadSingleRequestI[];
}

export enum TransactionTypeEnum {
  SALE = 'SALE',
  PURCHASE = 'PURCHASE',
  EXPENSE = 'EXPENSE',
}
