import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ItemCreationComponent } from '../item-creation/item-creation.component';
import {
  ProductI,
  ProductsService,
} from 'src/app/core/services/products/products.service';
import { StoreInfoModel } from 'src/app/store/models/userStoreInfo.models';
import { CurrentStoreInfoService } from 'src/app/core/services/currentStore/current-store-info.service';
import { PaginationComponentComponent } from 'src/app/core/components/pagination-component/pagination-component.component';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss'],
  standalone: true,
  imports: [IonicModule, ItemCreationComponent, PaginationComponentComponent],
})
export class ItemsListComponent implements OnInit {
  products: ProductI[] = [];
  currentPage = 1;
  totalPages = 100;
  pageSize = 10;
  hasMoreProducts = true;
  currentStoreInfo: StoreInfoModel | undefined;

  constructor(
    private productsService: ProductsService,
    private currentStoreInfoService: CurrentStoreInfoService
  ) {}

  ngOnInit() {
    this.currentStoreInfoService.getCurrentStoreInfo().subscribe((response) => {
      this.currentStoreInfo = response;
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Fetch the data for the selected page or update the list accordingly
    }
  }

  changePageSize(pageSize: number) {
    console.log(pageSize);
    // Fetch the data for the new page size or update the list accordingly
  }

  loadProducts() {}
}
