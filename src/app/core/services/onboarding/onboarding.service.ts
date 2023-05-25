import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAuthHeaders } from '../../utils/authHeaders';
import { VerifyGSTINResponseI } from '../../components/onboarding-modal/onboarding-modal.component';

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

  verifyGSTIN(storeId: string, gstin: string){
    const url = this.baseUrl + `storeInfo/verifyGSTIN/${storeId}/${gstin}`
    const headers = getAuthHeaders();
    return this.httpClient.get(url, { headers: headers });
  }

  onboardGSTStore(storeId: string, gstInfo: VerifyGSTINResponseI){
    const url = this.baseUrl + `storeInfo/onboardStore`
    const headers = getAuthHeaders();
    const body = {
      gstInfo,
      storeId
    }
    return this.httpClient.post(url, body, { headers: headers });
  }
}
