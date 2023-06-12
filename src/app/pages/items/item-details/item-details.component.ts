import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { ItemCreationComponent } from '../item-creation/item-creation.component';
import { AppState } from 'src/app/store/models/state.model';
import { Store } from '@ngrx/store';
import { SelectedProductModel } from 'src/app/store/models/selectedProduct.models';
import { Observable, combineLatest, forkJoin, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  ProductI,
  ProductsService,
} from 'src/app/core/services/products/products.service';
import { CurrentStoreInfoService } from 'src/app/core/services/currentStore/current-store-info.service';
import { StoreInfoModel } from 'src/app/store/models/userStoreInfo.models';
import { HyphenPipe } from 'src/app/core/pipes/hyphen.pipe';
import { VariantSeperatorPipe } from 'src/app/core/pipes/variant-seperator.pipe';
import { VariantsListComponent } from '../variants-list/variants-list.component';
import { DiscountsListComponent } from '../discounts-list/discounts-list.component';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    ItemCreationComponent,
    CommonModule,
    HyphenPipe,
    VariantSeperatorPipe,
    VariantsListComponent,
    DiscountsListComponent,
  ],
})
export class ItemDetailsComponent implements OnInit {
  public selectedProductState$: Observable<SelectedProductModel> | undefined;
  public selectedProductState: SelectedProductModel | undefined;
  currentStoreInfo: StoreInfoModel | undefined;
  public productDetails: ProductI | undefined;
  constructor(
    private modalController: ModalController,
    private store: Store<AppState>,
    private productsService: ProductsService,
    private currentStoreInfoService: CurrentStoreInfoService
  ) {}

  ngOnInit() {
    this.selectedProductState$ = this.store.select(
      (store) => store.selectedProduct
    );
    console.log('here');
    combineLatest([
      this.currentStoreInfoService.getCurrentStoreInfo(),
      this.selectedProductState$,
    ]).subscribe({
      next: (v) => {
        const [currentStoreInfoResponse, selectedProduct] = v;
        this.currentStoreInfo = currentStoreInfoResponse;
        this.selectedProductState = selectedProduct;
        if (
          !this.currentStoreInfo?._id ||
          !this.selectedProductState.selectedProductId
        ) {
          return;
        }
        this.productsService
          .getStoreProductById(
            this.currentStoreInfo?._id,
            this.selectedProductState.selectedProductId
          )
          .subscribe((response) => {
            console.log(response);
            //@ts-ignore
            if (response.message === 'Success') {
              //@ts-ignore
              this.productDetails = response.body;
            }
          });
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete'),
    });
  }

  async openEditProductModal() {
    const modal = await this.modalController.create({
      component: ItemCreationComponent,
      componentProps: {
        editProduct: {
          ...this.productDetails,
        },
      },
      backdropDismiss: true,
      cssClass: 'side-modal',
    });

    modal.onDidDismiss().then((modalData) => {});
    return await modal.present();
  }
}
