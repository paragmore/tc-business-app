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
import { ScreenModel } from 'src/app/store/models/screen.models';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SelectedProductModel } from 'src/app/store/models/selectedProduct.models';
import { SearchFilterSortComponent } from 'src/app/core/components/search-filter-sort/search-filter-sort.component';
import { InfiniteScrollDirective } from 'src/app/core/directives/infinite-scroll.directive';

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
    InfiniteScrollDirective
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
  public screenState$: Observable<ScreenModel> | undefined;
  isMobile = false;
  public selectedProductState$: Observable<SelectedProductModel> | undefined;
  public selectedProductState: SelectedProductModel | undefined;
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
    this.screenState$.subscribe((screen) => (this.isMobile = screen.isMobile));
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

  async openItemDetailsPage(product: ProductI) {
    this.router.navigate([`item/${product._id}`]);
  }

  onInfiniteScroll(){
    console.log('event')
  }

  loadMoreData(event:any){
    console.log('daa', event)
    if(event){
      this.currentPage = this.currentPage +1;
      this.loadProducts(()=> event.target.complete())
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
    this.store.dispatch(
      setSelectedProduct({
        selectedProduct: { selectedProductId: product._id },
      })
    );
    this._location.replaceState(`items/${product._id}`);
    this.isMobile ? this.openItemDetailsPage(product) : null;
  }

  loadProducts(onLoadingFinished?:()=>void) {
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
            this.products = this.isMobile ? [...this.products, ...response.body.products] : [...response.body.products];
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
          onLoadingFinished && onLoadingFinished()
        }
      );
    console.log(3);
  }
}
