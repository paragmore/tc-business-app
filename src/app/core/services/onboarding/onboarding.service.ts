import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAuthHeaders } from '../../utils/authHeaders';

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
}
