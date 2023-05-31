import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAuthHeaders } from '../../utils/authHeaders';

export interface PaginationQueryParamsI {
  pageSize?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | '1' | '-1' | 'ascending' | 'decending';
}

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
