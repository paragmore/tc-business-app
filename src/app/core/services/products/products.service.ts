import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAuthHeaders } from '../../utils/authHeaders';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private httpClient: HttpClient) {}
  baseUrl = environment.production
    ? 'https://products-api.taxpayercorner.com'
    : 'http://localhost:8015';

  createStoreCategory(createCategoryRequest: CreateCategoryRequestI) {
    const url = `${this.baseUrl}/products/category/create`;
    console.log(url);
    const headers = getAuthHeaders();
    const body = {
      ...createCategoryRequest,
    };
    return this.httpClient.post(url, body, { headers: headers });
  }

  createStoreProduct(createProductRequest: CreateProductRequestI) {
    const url = `${this.baseUrl}/products/create`;
    const headers = getAuthHeaders();
    const body = {
      ...createProductRequest,
    };
    return this.httpClient.post(url, body, { headers: headers });
  }

  bulkProductsUpload(bulkProductsUploadRequest: BulkProductsUploadRequestI) {
    const url = `${this.baseUrl}/products/bulk/create`;
    const headers = getAuthHeaders();
    const body = {
      ...bulkProductsUploadRequest,
    };
    return this.httpClient.post(url, body, { headers: headers });
  }

  updateStoreProduct(createProductRequest: UpdateProductRequestI) {
    const url = `${this.baseUrl}/products/update`;
    const headers = getAuthHeaders();
    const body = {
      ...createProductRequest,
    };
    return this.httpClient.put(url, body, { headers: headers });
  }

  getAllStoreCategories(storeId: string, options?: GetCategoriesQueryParamsI) {
    const queryParams = new URLSearchParams();
    if (options?.search) {
      queryParams.append('search', options.search);
    }
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
    }/products/category/${storeId}?${queryParams.toString()}`;
    const headers = getAuthHeaders();
    return this.httpClient.get(url, { headers: headers });
  }

  getStoreProductById(storeId: string, productId: string) {
    const url = `${this.baseUrl}/products/${storeId}/${productId}`;
    const headers = getAuthHeaders();
    return this.httpClient.get(url, { headers: headers });
  }
  getAllStoreProducts(storeId: string, options?: GetProductsQueryParamsI) {
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
    if (options?.category) {
      queryParams.append('category', options.category);
    }
    if (options?.maxPurchasePrice) {
      queryParams.append('maxPurchasePrice', options.maxPurchasePrice);
    }
    if (options?.maxQuantity) {
      queryParams.append('maxQuantity', options.maxQuantity);
    }
    if (options?.maxSellsPrice) {
      queryParams.append('maxSellsPrice', options.maxSellsPrice);
    }
    if (options?.minPurchasePrice) {
      queryParams.append('minPurchasePrice', options.minPurchasePrice);
    }
    if (options?.minQuantity) {
      queryParams.append('minQuantity', options.minQuantity);
    }
    if (options?.minSellsPrice) {
      queryParams.append('minSellsPrice', options.minSellsPrice);
    }
    if (options?.itemType) {
      queryParams.append('itemType', options.itemType);
    }
    const url = `${this.baseUrl}/products/${storeId}?${queryParams.toString()}`;
    const headers = getAuthHeaders();
    return this.httpClient.get(url, { headers: headers });
  }

  deleteStoreProduct(storeId: string, productIds: string[]) {
    const url = `${this.baseUrl}/products/delete`;
    const headers = getAuthHeaders();
    const body = {
      storeId,
      productIds,
    };
    return this.httpClient.post(url, body, { headers: headers });
  }

  deleteStorecategory(storeId: string, categoryIds: string[]) {
    const url = `${this.baseUrl}/products/delete/category`;
    const headers = getAuthHeaders();
    const body = {
      storeId,
      categoryIds,
    };
    return this.httpClient.post(url, body, { headers: headers });
  }

  getHSNCodes(type: ItemTypeEnum, options?: GetHSNCodesQueryParamsI) {
    const queryParams = new URLSearchParams();
    if (options?.search) {
      queryParams.append('search', options.search);
    }
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
    const url = `${this.baseUrl}/products/hsnCodes/${type}?${queryParams
      .toString()
      .replace('%2C', ',')}`;
    const headers = getAuthHeaders();
    return this.httpClient.get(url, { headers: headers });
  }
}
export interface CategoryI {
  name: string;
  description: string;
  storeId: string;
  slug: string;
  _id: string;
}

export interface CreateCategoryRequestI {
  name: string;
  description?: string;
  storeId: string;
}

export interface VariantPropertiesI {
  [key: string]: string;
}

export interface VariantI {
  properties: VariantPropertiesI;
  stockQuantity: number;
  sellsPrice?: number;
  skuId?: number;
  discounts?: DiscountI[];
  imageUrls?: string[];
}

export interface UnitI {
  quantity?: number;
  name: string;
  conversion?: number;
}

export interface DiscountI {
  type: 'percentage' | 'amount';
  code: string;
  minType: 'orderQuantity' | 'orderValue';
  value: number;
  minimum?: number;
  maxDiscount?: number;
}

export interface ProductI {
  storeId: string;
  name: string;
  description?: string;
  sellsPrice: number;
  purchasePrice?: number;
  category: CategoryI[];
  variants: VariantI[];
  heroImage?: string;
  images: string[];
  slug: string;
  quantity: number;
  discounts: DiscountI[];
  hsnCode?: string;
  taxIncluded?: boolean;
  unit: UnitI;
  purchaseUnit?: UnitI;
  gstPercentage?: number;
  deliveryTime?: string;
  isInventory?: boolean;
  inventoryProducts?: InventoryProductI[];
  lowStock?: number;
  _id: string;
  isService?: boolean;
  margin?: number;
  asPerMargin: boolean;
}

export interface InventoryProductI {
  productId: string;
  amountConsumed: number;
}

export type SortOrder = 'asc' | 'desc' | '1' | '-1' | 'ascending' | 'decending';

export interface PaginationQueryParamsI {
  pageSize?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface ProductsFilterByQueryI {
  category?: string;
  minSellsPrice?: string;
  maxSellsPrice?: string;
  minPurchasePrice?: string;
  maxPurchasePrice?: string;
  minQuantity?: string;
  maxQuantity?: string;
  itemType?: ItemTypeEnum;
}

export interface UpdateProductRequestI {
  productId: string;
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
  deliveryTime?: string;
  isInventory?: boolean;
  inventoryProducts?: InventoryProductI[];
  margin?: number;
  asPerMargin: boolean;
}

export interface CreateProductRequestI {
  storeId: string;
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
  purchaseUnitConversion?: string;
  gstPercentage?: number;
  deliveryTime?: string;
  isInventory?: boolean;
  inventoryProducts?: InventoryProductI[];
  isService: boolean;
  margin?: number;
  asPerMargin: boolean;
}

export interface BulkProductsUploadRequestI {
  storeId: string;
  products: BulkProductUploadSingleRequestI[];
}

export interface BulkProductUploadSingleRequestI {
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
  inventoryProducts?: InventoryProductI[];
  lowStock?: number;
  isService: boolean;
  margin?: number;
  asPerMargin: boolean;
}

export interface GetProductsQueryParamsI
  extends ProductsFilterByQueryI,
    PaginationQueryParamsI {}

export enum ItemTypeEnum {
  PRODUCT = 'Product',
  SERVICE = 'Service',
}

export interface HSNCodesFilterByQueryI {
  search: string;
}

export interface HSNCodesFilterByI {
  search: string;
}

export interface GetCategoriesQueryParamsI
  extends PaginationQueryParamsI,
    CategoriesFilterByI {}

export interface CategoriesFilterByI {
  search: string;
}
export interface GetHSNCodesQueryParamsI
  extends HSNCodesFilterByQueryI,
    PaginationQueryParamsI {}

export enum IncomeAccountTypeEnum {
  DISCOUNT = 'Discount',
  GENERAL_INCOME = 'General Income',
  INTEREST_INCOME = 'Interest Income',
  LATE_FEE_INCOME = 'Late Fee Income',
  OTHER_CHARGES = 'Other Charges',
  SALES = 'Sales',
  SHIPPING_CHARGE = 'Shipping Charge',
}

export enum CostOfGoodsSoldAccountTypeEnum {
  COST_OF_GOODS_SOLD = 'Cost of Goods Sold',
  LABOUR = 'Labour',
  JOB_COSTING = 'Job Consting',
  MATERIALS = 'Materials',
  SUBCONTRACTOR = 'Subcontractor',
}

export enum ExpenseAccountTypeEnum {
  ADVERTISING_AND_MARKETING = 'Advertising And Marketing',
  AUTOMOBILE_EXPENSE = 'Automobile Expense',
  BAD_DEBT = 'Bad Debt',
  BANK_FEES_AND_CHARGES = 'Bank Fees And Charges',
  CONSULTANT_EXPENSE = 'Consultant Expense',
  CONTRACT_ASSETS = 'Contract Assets',
  CREDIT_CARD_CHARGES = 'Credit Card Charges',
  DEPRECIATION_AND_AMORTISATION = 'Depreciation And Amortisation',
  DEPRECIATION_EXPENSE = 'Depreciation Expense',
  IT_AND_INTERNET_EXPENSES = 'IT And Internet Expenses',
  JANITORIAL_EXPENSES = 'Janitorial Expenses',
  LODGING = 'Lodging',
  MEALS_AND_ENTERTAINMENT = 'Meals And Entertainment',
  MERCHANDISE = 'Merchandise',
  OFFICE_SUPPLIES = 'Office Supplies',
  OTHER_EXPENSES = 'Other Expenses',
  POSTAGE = 'Postage',
  PRINTING_AND_STATIONERY = 'Printing And Stationery',
  RAW_MATERIALS_AND_CONSUMABLES = 'Raw Materials And Consumables',
  RENT_EXPENSE = 'Rent Expense',
  REPAIRS_AND_MAINTENANCE = 'Repairs And Maintenance',
  SALARIES_AND_EMPLOYEE_WAGES = 'Salaries and Employee Wages',
  TELEPHONE_EXPENSE = 'Telephone Expense',
  TRANSPORTATION_EXPENSE = 'Transportation Expense',
  TRAVEL_EXPENSE = 'Travel Expense',
  UNCATEGORIZED = 'Uncategorized',
}
