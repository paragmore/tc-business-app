import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }
  logout(): void {
    localStorage.removeItem('accessToken');
  }
}
