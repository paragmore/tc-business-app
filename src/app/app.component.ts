import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from './core/services/auth/auth.service';
import { setScreen } from './store/actions/screen.action';
import { ScreenModel } from './store/models/screen.models';
import { AppState } from './store/models/state.model';
import { TabsPage } from './tabs/tabs.page';
import { OnboardingService } from './core/services/onboarding/onboarding.service';
import { setUserStoreInfo } from './store/actions/userStoreInfo.action';
import { OnboardingModalComponent } from './core/components/onboarding-modal/onboarding-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    TabsPage,
    OnboardingModalComponent,
  ],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Transactions', url: '/transactions', icon: 'receipt' },
    { title: 'Payments', url: '/payments', icon: 'cash' },
    { title: 'Items', url: '/items', icon: 'pricetags' },
    { title: 'Parties', url: '/parties', icon: 'people' },
    { title: 'Reports', url: '/reports', icon: 'bar-chart' },
    { title: 'Orders', url: '/folder/orders', icon: 'cart' },
    { title: 'Settings', url: '/folder/settings', icon: 'settings' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  public screenState$: Observable<ScreenModel> | undefined;
  public currentRoute: string | undefined;
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private authService: AuthService,
    private onboardingService: OnboardingService,
    public modalController: ModalController
  ) {
    this.currentRoute = this.router.url;
    console.log(this.currentRoute);
  }

  async openOnboardingModal() {
    const modal = await this.modalController.create({
      component: OnboardingModalComponent,
      componentProps: {},
      backdropDismiss: false,
      cssClass: 'login-modal',
    });
    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        // this.modelData = modelData.data;
        // console.log('Modal Data : ' + modelData.data);
      }
    });
    return await modal.present();
  }

  onLogoutClicked() {
    this.authService.logout();
  }

  private checkScreenSize() {
    const screenWidth = window.innerWidth;
    this.store.dispatch(setScreen({ screen: { isMobile: screenWidth < 768 } }));
  }
  ngOnInit(): void {
    this.screenState$ = this.store.select((store) => store.screen);
    this.checkScreenSize();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // URL has changed, do something
        console.log('Router URL has changed:', event.url);
        this.currentRoute = event.url;
      }
    });

    this.onboardingService.getUserAndStoreInfo().subscribe(
      (response) => {
        console.log('response', response);

        //@ts-ignore
        if (
          //@ts-ignore
          !response.body.stores.find(
            //@ts-ignore
            (store) => store._id === response.body.defaultStoreId
          ).name
        ) {
          this.openOnboardingModal();
        }

        //@ts-ignore
        this.store.dispatch(
          setUserStoreInfo({
            userStoreInfo: {
              //@ts-ignore
              ...response.body,
              //@ts-ignore
              currentStoreId: response.body.defaultStoreId,
            },
          })
        );
      },
      (error) => {}
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }
}
