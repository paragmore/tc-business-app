import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [],
})
export class LoginComponent implements OnInit {
  loginHtml: SafeHtml | undefined;
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.http
      .get(
        'http://localhost:8000/auth?storeId=645228c0b530694160ad1ff4&userType=CUSTOMER',
        {
          responseType: 'text',
        }
      )
      .subscribe((html: string) => {
        this.loginHtml = this.sanitizer.bypassSecurityTrustHtml(html);
        const div = document.createElement('div');
        div.innerHTML = html;
        const mainDiv = document.getElementById('login-ionic-container');
        mainDiv?.appendChild(div);
        const script = document.createElement('script');
        if (div.querySelector('script') != null) {
          console.log(div.querySelector('script') != null);
          const scriptH = div.querySelector('script')?.innerHTML;
          const scriptSrc = div.querySelector('script')?.src;
          if (scriptSrc) {
            script.src = scriptSrc;
          }
          if (scriptH) {
            script.innerHTML = scriptH;
          }
        }

        document.body.appendChild(script);
      });

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }
}
