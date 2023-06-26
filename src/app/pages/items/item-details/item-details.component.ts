import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { ItemCreationComponent } from '../item-creation/item-creation.component';
import { AppState } from 'src/app/store/models/state.model';
import { Store } from '@ngrx/store';
import { SelectedProductModel } from 'src/app/store/models/selectedProduct.models';
import { Observable, combineLatest, forkJoin, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  ItemTypeEnum,
  ProductI,
  ProductsService,
} from 'src/app/core/services/products/products.service';
import { CurrentStoreInfoService } from 'src/app/core/services/currentStore/current-store-info.service';
import { StoreInfoModel } from 'src/app/store/models/userStoreInfo.models';
import { HyphenPipe } from 'src/app/core/pipes/hyphen.pipe';
import { VariantSeperatorPipe } from 'src/app/core/pipes/variant-seperator.pipe';
import { VariantsListComponent } from '../variants-list/variants-list.component';
import { DiscountsListComponent } from '../discounts-list/discounts-list.component';
import { RightHeaderComponent } from 'src/app/right-header/right-header.component';
import { setSelectedItem } from 'src/app/store/actions/items.action';

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
    RightHeaderComponent,
  ],
})
export class ItemDetailsComponent implements OnInit {
  public selectedProductState$: Observable<SelectedProductModel> | undefined;
  public selectedProductState: SelectedProductModel | undefined;
  currentStoreInfo: StoreInfoModel | undefined;
  public productDetails: ProductI | undefined;
  isMobile = false;
  type: ItemTypeEnum | undefined;
  ItemTypeEnum = ItemTypeEnum;
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

    this.store
      .select((store) => store.items)
      .subscribe((items) => (this.productDetails = items.selectedItem));
    const screenState$ = this.store.select((store) => store.screen);
    screenState$.subscribe((screen) => {
      this.isMobile = screen.isMobile;
    });
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
              this.store.dispatch(
                //@ts-ignore
                setSelectedItem({ selectedItem: response.body })
              );

              this.type = this.productDetails?.isService
                ? ItemTypeEnum.SERVICE
                : ItemTypeEnum.PRODUCT;
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
        type: this.type,
      },
      backdropDismiss: true,
      cssClass: 'side-modal',
    });

    modal.onDidDismiss().then((modalData) => {});
    return await modal.present();
  }
}
