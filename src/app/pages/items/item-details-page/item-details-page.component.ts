import { Component, OnInit, inject } from '@angular/core';
import { ItemDetailsComponent } from '../item-details/item-details.component';
import { ActivatedRoute } from '@angular/router';
import { setSelectedProduct } from 'src/app/store/actions/selectedProduct.action';
import { AppState } from 'src/app/store/models/state.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-item-details-page',
  templateUrl: './item-details-page.component.html',
  styleUrls: ['./item-details-page.component.scss'],
  standalone: true,
  imports: [ItemDetailsComponent],
})
export class ItemDetailsPageComponent implements OnInit {
  public productId!: string;
  private activatedRoute = inject(ActivatedRoute);

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.openProductDetails();
  }

  openProductDetails() {
    this.store.dispatch(
      setSelectedProduct({
        selectedProduct: { selectedProductId: this.productId },
      })
    );
  }
}
