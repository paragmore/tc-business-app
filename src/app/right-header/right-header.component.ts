import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { UserStoreInfoModel } from '../store/models/userStoreInfo.models';
import { Store } from '@ngrx/store';
import { AppState } from '../store/models/state.model';

@Component({
  selector: 'app-right-header',
  templateUrl: './right-header.component.html',
  styleUrls: ['./right-header.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class RightHeaderComponent implements OnInit {
  public route!: string;
  userStoreInfoState$: Observable<UserStoreInfoModel> | undefined;
  userStoreInfoState: UserStoreInfoModel | undefined;
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.userStoreInfoState$ = this.store.select(
      (store) => store.userStoreInfo
    );
    this.userStoreInfoState$?.subscribe(
      (userStoreInfo) => (this.userStoreInfoState = userStoreInfo)
    );
  }
}
