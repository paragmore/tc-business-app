import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OnboardingModalComponent } from './components/onboarding-modal/onboarding-modal.component';
import { AuthService } from './core/services/auth/auth.service';
import { setScreen } from './store/actions/screen.action';
import { ScreenModel } from './store/models/screen.models';
import { AppState } from './store/models/state.model';
import { TabsPage } from './tabs/tabs.page';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive, CommonModule, TabsPage, OnboardingModalComponent],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'mail' },
    { title: 'Transactions', url: '/transactions', icon: 'paper-plane' },
    { title: 'Items', url: '/items', icon: 'heart' },
    { title: 'Customers', url: '/customers', icon: 'archive' },
    { title: 'Collections', url: '/folder/trash', icon: 'trash' },
    { title: 'Orders', url: '/folder/spam', icon: 'warning' },
    { title: 'Reports', url: '/folder/spam', icon: 'warning' },
    { title: 'Settings', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  public screenState$: Observable<ScreenModel> | undefined;
  public currentRoute: string | undefined
  constructor(private store: Store<AppState>,private router: Router, private authService: AuthService) {
    this.currentRoute = this.router.url;
    console.log(this.currentRoute)
  }

  onLogoutClicked(){
    this.authService.logout()
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
        this.currentRoute = event.url
      }
    });
  }



  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }
}
