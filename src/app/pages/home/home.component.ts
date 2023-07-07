import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RevenueChartComponent } from 'src/app/charts/revenue-chart.component';
import { RightHeaderComponent } from 'src/app/right-header/right-header.component';
import { AppState } from 'src/app/store/models/state.model';
import { UserStoreInfoModel } from 'src/app/store/models/userStoreInfo.models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonicModule, RevenueChartComponent, RightHeaderComponent],
})
export class HomeComponent implements OnInit {
  public route!: string;
  private activatedRoute = inject(ActivatedRoute);
  userStoreInfoState$: Observable<UserStoreInfoModel> | undefined;
  userStoreInfoState: UserStoreInfoModel | undefined;
  quickActionsList: {
    title: string;
    subtitle: string;
    icon: string;
    onClick?: () => void;
  }[] = [
    {
      title: 'Manage Items',
      subtitle: 'Total items added: 0',
      icon: '',
    },
    {
      title: 'Manage Transactions',
      subtitle: 'Total items added: 0',
      icon: '',
    },
    {
      title: 'Store Reports',
      subtitle: 'Todays sale: 0',
      icon: '',
    },
  ];
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.route = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.userStoreInfoState$ = this.store.select(
      (store) => store.userStoreInfo
    );
    this.userStoreInfoState$?.subscribe(
      (userStoreInfo) => (this.userStoreInfoState = userStoreInfo)
    );
  }
}
