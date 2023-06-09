import { Injectable } from '@angular/core';
import { getAuthHeaders } from '../../utils/authHeaders';
import { HttpClient } from '@angular/common/http';
import { PaginationQueryParamsI } from '../products/products.service';

@Injectable({
  providedIn: 'root',
})
export class PartiesService {
  constructor(private httpClient: HttpClient) {}
  baseUrl = 'http://localhost:8020/';

  createParty(createPartyRequest: CreatePartyRequestI) {
    const url = this.baseUrl + `parties/create`;
    const headers = getAuthHeaders();
    const body = {
      ...createPartyRequest,
    };
    return this.httpClient.post(url, body, { headers: headers });
  }

  updateParty(updateParty: UpdatePartyRequestI) {
    const url = this.baseUrl + `parties/update`;
    const headers = getAuthHeaders();
    const body = {
      ...updateParty,
    };
    return this.httpClient.put(url, body, { headers: headers });
  }

  getAllStoreParties(
    storeId: string,
    type: PartyTypeEnum,
    options?: GetPartiesQueryParamsI
  ) {
    const queryParams = new URLSearchParams();
    if (options?.balance) {
      queryParams.append('balance', options.balance);
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
    const url =
      this.baseUrl + `parties/${storeId}/${type}?${queryParams.toString()}`;
    const headers = getAuthHeaders();
    return this.httpClient.get(url, { headers: headers });
  }

  getStorePartyById(storeId: string, type: PartyTypeEnum, partyId: string) {
    const url = this.baseUrl + `parties/${storeId}/${type}/${partyId}`;
    const headers = getAuthHeaders();
    return this.httpClient.get(url, { headers: headers });
  }
}

export interface CreatePartyRequestI {
  type: PartyTypeEnum;
  storeId: string;
  name: string;
  phoneNumber: string;
  email?: string;
  balance?: number;
  gstin?: string;
  address: AdrressesI;
}

export enum PartyTypeEnum {
  CUSTOMER = 'customer',
  SUPPLIER = 'supplier',
}

export interface AdrressesI {
  shipping: AddressI;
  billingSameAsShipping: boolean;
  billing?: AddressI;
}
export interface AddressI {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface UpdatePartyRequestI {
  partyId: string;
  type: PartyTypeEnum;
  storeId: string;
  phoneNumber: string;
  name?: string;
  email?: string;
  balance?: number;
  gstin?: string;
  address?: AdrressesI;
}

export interface GetPartiesQueryParamsI
  extends PartiesFilterByQueryI,
    PaginationQueryParamsI {}

export interface GetAllStorePartiesParams {
  storeId: string;
  type: PartyTypeEnum;
}

export interface PartiesFilterByQueryI {
  balance?: string;
}

export interface CustomerI {
  phoneNumber: string;
  name?: string;
  email?: string;
  gstin?: string;
  addresses?: Array<AdrressesI>;
  photoUrl?: string;
  lastLogin?: Date;
  searchQueries?: Array<SearchQueryI>;
  reviews?: Array<string>;
  favouriteProducts?: Array<string>;
  _id: string;
}

export interface SearchQueryI {
  searchTerm: string;
  storeId: string;
}

export interface SupplierI {
  phoneNumber: string;
  email?: string;
  name?: string;
  balance?: number;
  gstin?: string;
  addresses?: Array<AdrressesI>;
  photoUrl?: string;
  storeId: string;
  supplierStoreId?: string;
}

export interface CustomerStoreInfoI {
  _id: string;
  cart?: string;
  totalSpent?: number;
  storeId: string;
  balance?: number;
  email?: string;
  name?: string;
  addresses?: Array<AdrressesI>;
  customerId: string;
  gstin?: string;
}

export interface GetAllCustomersResponseI {
  customer: CustomerI;
  customerStoreInfo: CustomerStoreInfoI;
}