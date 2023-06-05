import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DividedPageBuilderComponent } from './../../core/components/divided-page-builder/divided-page-builder.component';
import { ItemCreationComponent } from './item-creation/item-creation.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { ItemsListComponent } from './items-list/items-list.component';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { setSelectedProduct } from 'src/app/store/actions/selectedProduct.action';
import { AppState } from 'src/app/store/models/state.model';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
  standalone: true,
  imports: [ItemCreationComponent, IonicModule, DividedPageBuilderComponent],
  providers: [ItemsListComponent, ItemDetailsComponent],
})
export class ItemsComponent implements OnInit {
  itemsListComponent = ItemsListComponent;
  itemDetailsComponent = ItemDetailsComponent;
  public productId: string | undefined;
  private activatedRoute = inject(ActivatedRoute);

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.openProductDetails();
  }

  openProductDetails() {
    if (this.productId) {
      this.store.dispatch(
        setSelectedProduct({
          selectedProduct: { selectedProductId: this.productId },
        })
      );
    }
  }
}
