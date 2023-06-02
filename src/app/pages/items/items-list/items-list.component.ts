import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { ItemCreationComponent } from '../item-creation/item-creation.component';
import {
  ProductI,
  ProductsService,
  SortOrder,
} from 'src/app/core/services/products/products.service';
import { StoreInfoModel } from 'src/app/store/models/userStoreInfo.models';
import { CurrentStoreInfoService } from 'src/app/core/services/currentStore/current-store-info.service';
import { PaginationComponentComponent } from 'src/app/core/components/pagination-component/pagination-component.component';
import { CommonModule } from '@angular/common';
import { AppState } from 'src/app/store/models/state.model';
import { Store } from '@ngrx/store';
import { setSelectedProduct } from 'src/app/store/actions/selectedProduct.action';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    ItemCreationComponent,
    PaginationComponentComponent,
    CommonModule,
  ],
})
export class ItemsListComponent implements OnInit {
  products: ProductI[] = [];
  currentPage = 1;
  totalPages = 100;
  pageSize = 10;
  hasMoreProducts = true;
  currentStoreInfo: StoreInfoModel | undefined;
  sortBy: string = 'name';
  sortOrder: SortOrder = 'asc';
  isProductsLoading = false;

  constructor(
    private productsService: ProductsService,
    private currentStoreInfoService: CurrentStoreInfoService,
    private modalController: ModalController,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.currentStoreInfoService.getCurrentStoreInfo().subscribe((response) => {
      this.currentStoreInfo = response;
      this.loadProducts();
    });
  }

  async openAddProductModal() {
    const modal = await this.modalController.create({
      component: ItemCreationComponent,
      backdropDismiss: true,
      cssClass: 'side-modal',
    });

    modal.onDidDismiss().then((modalData) => {});
    return await modal.present();
  }

  toggleSort(sortBy: string, order: SortOrder) {
    this.sortBy = sortBy;
    this.sortOrder = order;
    this.loadProducts();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Fetch the data for the selected page or update the list accordingly
      this.loadProducts(page);
    }
  }

  changePageSize(pageSize: number) {
    console.log(pageSize);
    this.pageSize = pageSize;
    this.loadProducts();
    // Fetch the data for the new page size or update the list accordingly
  }

  openProductDetails(product: ProductI) {
    this.store.dispatch(
      setSelectedProduct({
        selectedProduct: { selectedProductId: product._id },
      })
    );
  }

  loadProducts(page?: number) {
    if (this.isProductsLoading) {
      return;
    }
    if (!this.currentStoreInfo?._id) {
      return;
    }
    this.isProductsLoading = true;
    console.log(1);
    this.productsService
      .getAllStoreProducts(this.currentStoreInfo?._id, {
        page: this.currentPage.toString(),
        pageSize: this.pageSize.toString(),
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
      })
      .subscribe(
        (response) => {
          console.log(2);

          //@ts-ignore
          if (response.message === 'Success') {
            //@ts-ignore
            console.log(response.body.products);
            //@ts-ignore
            this.products = [...response.body.products];
            //@ts-ignore
            const pagination = response.body.pagination;
            this.currentPage = pagination.page;
            this.pageSize = pagination.pageSize;
            this.totalPages = pagination.totalPages;
          }
        },
        (error) => {},
        () => {
          this.isProductsLoading = false;
        }
      );
    console.log(3);
  }
}
