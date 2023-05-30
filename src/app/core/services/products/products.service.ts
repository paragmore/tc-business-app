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
