import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setScreen } from './store/actions/screen.action';
import { ScreenModel } from './store/models/screen.models';
import { AppState } from './store/models/state.model';
import { TabsPage } from './tabs/tabs.page';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive, CommonModule, TabsPage],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'mail' },
    { title: 'Transactions', url: '/transactions', icon: 'paper-plane' },
    { title: 'Items', url: '/items', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  public screenState$: Observable<ScreenModel> | undefined;
  constructor(private store: Store<AppState>) {}

  private checkScreenSize() {
    const screenWidth = window.innerWidth;
    this.store.dispatch(setScreen({ screen: { isMobile: screenWidth < 768 } }));
  }
  ngOnInit(): void {
    this.screenState$ = this.store.select((store) => store.screen);
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }
}
