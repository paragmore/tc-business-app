import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../../app/core/services/auth/auth.service';
import { Router } from '@angular/router';
import { IonicModule, IonModal, ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { CommonModule } from '@angular/common';
import { LoginModalPage } from './login-modal.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app/store/models/state.model';
import { ScreenModel } from '../../../app/store/models/screen.models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/core/services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, LoginModalPage],
})
export class LoginComponent implements OnInit {
  loginHtml: SafeHtml | undefined;
  modelData: any;
  isMobile = false;
  public screenState$: Observable<ScreenModel> | undefined;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private router: Router,
    public modalController: ModalController,
    private store: Store<AppState>,
    private loginService: LoginService
  ) {}

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    if (!this.isModalOpen) {
      this.openLoginModal();
    }
    this.isModalOpen = isOpen;
  }
  async openLoginModal() {
    const modal = await this.modalController.create({
      component: LoginModalPage,
      componentProps: {
        modalHtml: this.loginHtml,
      },
      backdropDismiss: false,
      cssClass: 'login-modal',
      id: 'login-ionic-container',
    });
    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        this.modelData = modelData.data;
        console.log('Modal Data : ' + modelData.data);
      }
    });
    return await modal.present();
  }
  ngOnInit() {
    this.loginService.getAuthHtml().subscribe((html: string) => {
      this.loginHtml = this.sanitizer.bypassSecurityTrustHtml(html);
      const div = document.createElement('div');
      div.innerHTML = html;
      // const mainDiv = document.getElementById('login-ionic-container');
      // console.log(mainDiv);
      // mainDiv?.appendChild(div);
      // console.log(mainDiv);
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
      this.screenState$ = this.store.select((store) => store.screen);
      this.screenState$.subscribe((screen) => {
        this.isMobile = screen.isMobile;
        if (screen.isMobile) {
          this.setOpen(true);
        }
      });
      document.body.appendChild(script);
    });

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }
}
