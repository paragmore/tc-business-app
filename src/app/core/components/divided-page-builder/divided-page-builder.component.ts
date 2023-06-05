import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ItemDetailsComponent } from 'src/app/pages/items/item-details/item-details.component';
import { ItemsListComponent } from 'src/app/pages/items/items-list/items-list.component';
import { ScreenModel } from 'src/app/store/models/screen.models';
import { AppState } from 'src/app/store/models/state.model';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-divided-page-builder',
  templateUrl: './divided-page-builder.component.html',
  styleUrls: ['./divided-page-builder.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ItemsListComponent,
    ItemDetailsComponent,
  ],
  animations: [],
})
export class DividedPageBuilderComponent implements OnInit {
  @Input() listComponent: any;
  @Input() detailsComponent: any;
  public screenState$: Observable<ScreenModel> | undefined;

  isDetailsViewOpen = true;
  constructor(
    private store: Store<AppState>,
    private animationCtrl: AnimationController
  ) {
    console.log(this.listComponent, this.detailsComponent);
  }

  ngOnInit() {
    this.screenState$ = this.store.select((store) => store.screen);

    console.log(this.listComponent, this.detailsComponent);
  }

  toggleDetailsView() {
    this.isDetailsViewOpen = !this.isDetailsViewOpen;
  }
}
