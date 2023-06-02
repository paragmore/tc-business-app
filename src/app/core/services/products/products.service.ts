import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAuthHeaders } from '../../utils/authHeaders';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private httpClient: HttpClient) {}
  baseUrl = 'http://localhost:8015/';

  createStoreCategory(createCategoryRequest: CreateCategoryRequestI) {
    const url = this.baseUrl + `products/category/create`;
    const headers = getAuthHeaders();
    const body = {
      ...createCategoryRequest,
    };
    return this.httpClient.post(url, body, { headers: headers });
  }

  createStoreProduct(createProductRequest: CreateProductRequestI) {
    const url = this.baseUrl + `products/category/create`;
    const headers = getAuthHeaders();
    const body = {
      ...createProductRequest,
    };
    return this.httpClient.post(url, body, { headers: headers });
  }

  getAllStoreCategories(storeId: string, options?: PaginationQueryParamsI) {
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
    const url =
      this.baseUrl + `products/category/${storeId}?${queryParams.toString()}`;
    const headers = getAuthHeaders();
    return this.httpClient.get(url, { headers: headers });
  }

  getStoreProductById(storeId: string, productId: string) {
    const url = this.baseUrl + `products/${storeId}/${productId}`;
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
    const url = this.baseUrl + `products/${storeId}?${queryParams.toString()}`;
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
  discount?: DiscountI;
  imageUrls?: string[];
}

export interface UnitI {
  quantity?: number;
  name: string;
  conversion?: number;
}

export interface DiscountI {
  volumeThreshold: number;
  discountPercentage: number;
}

export interface ProductI {
  storeId: string;
  name: string;
  description?: string;
  sellsPrice: number;
  purchasePrice?: number;
  category: string[];
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
  _id: string;
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
}

export interface CreateProductRequestI extends ProductI {}

export interface GetProductsQueryParamsI
  extends ProductsFilterByQueryI,
    PaginationQueryParamsI {}
