import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { ItemCreationComponent } from '../item-creation/item-creation.component';
import {
  ItemTypeEnum,
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
import { ScreenModel } from 'src/app/store/models/screen.models';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SelectedProductModel } from 'src/app/store/models/selectedProduct.models';
import {
  FilterSortListsI,
  SearchFilterSortComponent,
} from 'src/app/core/components/search-filter-sort/search-filter-sort.component';
import { InfiniteScrollDirective } from 'src/app/core/directives/infinite-scroll.directive';
import { LongPressDirective } from 'src/app/core/directives/long-press.directive';
import { HyphenPipe } from 'src/app/core/pipes/hyphen.pipe';

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
    SearchFilterSortComponent,
    InfiniteScrollDirective,
    LongPressDirective,
    HyphenPipe,
  ],
})
export class ItemsListComponent implements OnInit {
  selectedTab: ItemTypeEnum = ItemTypeEnum.PRODUCT;
  ItemTypeEnum = ItemTypeEnum;
  products: ProductI[] = [];
  currentPage = 1;
  totalPages = 100;
  pageSize = 10;
  hasMoreProducts = true;
  currentStoreInfo: StoreInfoModel | undefined;
  sortBy: string = 'name';
  sortOrder: SortOrder = 'asc';
  isProductsLoading = false;
  public screenState$: Observable<ScreenModel> | undefined;
  isMobile = false;
  public selectedProductState$: Observable<SelectedProductModel> | undefined;
  public selectedProductState: SelectedProductModel | undefined;
  enableMultiSelect = true;
  selectedProducts: ProductI[] = [];
  filterSortOptions: FilterSortListsI = {
    filter: [
      { value: 'quantity', text: 'Low Stock' },
      { value: 'quantity', text: 'In Stock' },
    ],
    sort: [
      { value: 'sellsPrice', text: 'Sells Price Low to High' },
      { value: 'sellsPrice', text: 'Sells Price High to Low' },
    ],
  };
  constructor(
    private productsService: ProductsService,
    private currentStoreInfoService: CurrentStoreInfoService,
    private modalController: ModalController,
    private store: Store<AppState>,
    private router: Router,
    private _location: Location
  ) {}

  ngOnInit() {
    this.screenState$ = this.store.select((store) => store.screen);
    this.screenState$.subscribe((screen) => {
      this.isMobile = screen.isMobile;
      this.enableMultiSelect = !this.isMobile;
    });
    this.currentStoreInfoService.getCurrentStoreInfo().subscribe((response) => {
      this.currentStoreInfo = response;
      this.loadProducts();
    });
    this.selectedProductState$ = this.store.select(
      (store) => store.selectedProduct
    );
    this.selectedProductState$.subscribe((productState) => {
      this.selectedProductState = productState;
    });
    this.selectedTab = ItemTypeEnum.PRODUCT;
  }

  updateSelectedTab(event: any) {
    this.selectedTab = event.detail.value;
    this.loadProducts();
  }

  onProductSelectionToggle(event: any, product: ProductI) {
    if (event.detail.checked) {
      this.selectedProducts.push(product);
    }
    if (event.detail.checked === false) {
      const deleteIndex = this.selectedProducts.findIndex(
        (prod) => prod._id === product._id
      );
      this.selectedProducts.splice(deleteIndex, 1);
    }
    console.log(this.selectedProducts);
  }

  isProductSelected(product: ProductI) {
    return this.selectedProducts.find((prod) => prod._id === product._id);
  }

  selectAllToggle(event: any) {
    if (event.detail.checked) {
      this.selectedProducts = this.products;
    }
    if (event.detail.checked === false) {
      this.selectedProducts = [];
    }
  }

  onMultipleSelectCancel() {
    this.selectedProducts = [];
  }

  onLongPress() {
    console.log('long');
    this.enableMultiSelect = true;
  }

  async openAddProductModal() {
    const modal = await this.modalController.create({
      component: ItemCreationComponent,
      componentProps: { type: this.selectedTab },
      backdropDismiss: true,
      cssClass: 'side-modal',
    });

    modal.onDidDismiss().then((modalData) => {});
    return await modal.present();
  }

  async openItemDetailsPage(product: ProductI) {
    this.router.navigate([`item/${product._id}`]);
  }

  onInfiniteScroll() {
    console.log('event');
  }

  loadMoreData(event: any) {
    console.log('daa', event);
    if (event) {
      this.currentPage = this.currentPage + 1;
      this.loadProducts(() => event.target.complete());
    }
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
      this.loadProducts();
    }
  }

  changePageSize(pageSize: number) {
    console.log(pageSize);
    this.pageSize = pageSize;
    this.loadProducts();
    // Fetch the data for the new page size or update the list accordingly
  }

  openProductDetails(product: ProductI) {
    if (this.enableMultiSelect && this.isMobile) {
      return;
    }
    this.store.dispatch(
      setSelectedProduct({
        selectedProduct: { selectedProductId: product._id },
      })
    );
    this._location.replaceState(`items/${product._id}`);
    this.isMobile ? this.openItemDetailsPage(product) : null;
  }

  loadProducts(onLoadingFinished?: () => void) {
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
        itemType: this.selectedTab,
      })
      .subscribe(
        (response) => {
          console.log(2);

          //@ts-ignore
          if (response.message === 'Success') {
            //@ts-ignore
            console.log(response.body.products);
            //@ts-ignore
            this.products = this.isMobile
              ? //@ts-ignore

                [...this.products, ...response.body.products]
              : //@ts-ignore

                [...response.body.products];
            !this.isMobile &&
              !this.selectedProductState?.selectedProductId &&
              this.openProductDetails(this.products[0]);
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
          onLoadingFinished && onLoadingFinished();
        }
      );
    console.log(3);
  }
}
