import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }
  logout(): void {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/login'])
  }
}
