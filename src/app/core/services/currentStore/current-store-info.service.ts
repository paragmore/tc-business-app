import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app/store/models/state.model';
import { UserStoreInfoModel } from 'src/app/store/models/userStoreInfo.models';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrentStoreInfoService {
  constructor(private store: Store<AppState>) {}
  userStoreInfoState$: Observable<UserStoreInfoModel> | undefined;
  userStoreInfoState: UserStoreInfoModel | undefined;
  getCurrentStoreInfo(): Observable<any> {
    this.userStoreInfoState$ = this.store.select((store) => store.userStoreInfo);

    return this.userStoreInfoState$.pipe(
      map((userStoreInfo) =>
        userStoreInfo.stores.find(
          (store) => userStoreInfo.currentStoreId === store._id
        )
      )
    );
  }

}
