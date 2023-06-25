import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAuthHeaders } from '../../utils/authHeaders';
import { environment } from 'src/environments/environment';

export interface OnboardStoreRequestI {
  storeId: string;
  gstInfo?: VerifyGSTINResponseI;
  name?: string;
  logoUrl?: string;
  businessType?: string;
  businessDomain?: string;
  allowCreditReportAccess?: boolean;
  onlineStoreLive?: boolean;
  plan?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  constructor(private httpClient: HttpClient) {}
  baseUrl = environment.production
    ? 'https://storeinfo-api.taxpayercorner.com'
    : 'http://localhost:8005';

  getUserAndStoreInfo() {
    const url = `${this.baseUrl}/storeInfo`;
    const headers = getAuthHeaders();
    return this.httpClient.get(url, { headers: headers });
  }

  verifyGSTIN(storeId: string, gstin: string) {
    const url = `${this.baseUrl}/storeInfo/verifyGSTIN/${storeId}/${gstin}`;
    const headers = getAuthHeaders();
    return this.httpClient.get(url, { headers: headers });
  }

  onboardStore(onboardStoreRequest: OnboardStoreRequestI) {
    const url = `${this.baseUrl}/storeInfo/onboardStore`;
    const headers = getAuthHeaders();
    const body = {
      ...onboardStoreRequest,
    };
    return this.httpClient.post(url, body, { headers: headers });
  }

  onboardNonGSTStore(storeId: string, gstInfo: VerifyGSTINResponseI) {
    const url = `${this.baseUrl}/storeInfo/onboardStore`;
    const headers = getAuthHeaders();
    const body = {
      gstInfo,
      storeId,
    };
    return this.httpClient.post(url, body, { headers: headers });
  }
}

export interface VerifyGSTINResponseI {
  ntcrbs: string;
  adhrVFlag: string;
  lgnm: string;
  stj: string;
  dty: string;
  cxdt: string;
  gstin: string;
  nba: string[];
  ekycVFlag: string;
  cmpRt: string;
  rgdt: string;
  ctb: string;
  pradr: {
    adr: string;
    addr: {
      flno: string;
      lg: string;
      loc: string;
      pncd: string;
      bnm: string;
      city: string;
      lt: string;
      stcd: string;
      bno: string;
      dst: string;
      st: string;
    };
  };
  sts: string;
  tradeNam: string;
  isFieldVisitConducted: string;
  ctj: string;
  einvoiceStatus: string;
  lstupdt: string;
  adadr: any[];
  ctjCd: string;
  errorMsg: null | string;
  stjCd: string;
}
