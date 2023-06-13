import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  baseUrl = environment.production
    ? 'https://login-api.taxpayercorner.com'
    : 'http://localhost:8000';
  constructor(private httpClient: HttpClient) {}

  getAuthHtml() {
    return this.httpClient.get(`${this.baseUrl}/auth?userType=BUSINESS_ADMIN`, {
      responseType: 'text',
    });
  }
}
