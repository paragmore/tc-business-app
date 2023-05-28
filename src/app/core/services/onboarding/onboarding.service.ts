import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAuthHeaders } from '../../utils/authHeaders';
import { VerifyGSTINResponseI } from '../../components/onboarding-modal/onboarding-modal.component';

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
  baseUrl = 'http://localhost:8005/';

  getUserAndStoreInfo() {
    const url = this.baseUrl + 'storeInfo';
    const headers = getAuthHeaders();
    return this.httpClient.get(url, { headers: headers });
  }

  verifyGSTIN(storeId: string, gstin: string) {
    const url = this.baseUrl + `storeInfo/verifyGSTIN/${storeId}/${gstin}`;
    const headers = getAuthHeaders();
    return this.httpClient.get(url, { headers: headers });
  }

  onboardStore(onboardStoreRequest: OnboardStoreRequestI) {
    const url = this.baseUrl + `storeInfo/onboardStore`;
    const headers = getAuthHeaders();
    const body = {
      ...onboardStoreRequest,
    };
    return this.httpClient.post(url, body, { headers: headers });
  }

  onboardNonGSTStore(storeId: string, gstInfo: VerifyGSTINResponseI) {
    const url = this.baseUrl + `storeInfo/onboardStore`;
    const headers = getAuthHeaders();
    const body = {
      gstInfo,
      storeId,
    };
    return this.httpClient.post(url, body, { headers: headers });
  }
}
