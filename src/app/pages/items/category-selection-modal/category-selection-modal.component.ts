import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CategoryCreationModalComponent } from '../category-creation-modal/category-creation-modal.component';
import { DialogHeaderComponent } from 'src/app/core/components/dialog-header/dialog-header.component';
import {
  CategoryI,
  ProductsService,
} from 'src/app/core/services/products/products.service';
import { CurrentStoreInfoService } from 'src/app/core/services/currentStore/current-store-info.service';
import { StoreInfoModel } from 'src/app/store/models/userStoreInfo.models';

@Component({
  selector: 'app-category-selection-modal',
  templateUrl: './category-selection-modal.component.html',
  styleUrls: ['./category-selection-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, DialogHeaderComponent],
})
export class CategorySelectionModalComponent implements OnInit {
  categories: CategoryI[] = [];
  currentPage = 1;
  pageSize = 10;
  hasMoreCategories = true;
  currentStoreInfo: StoreInfoModel | undefined;

  @Input() selectedCategories!: CategoryI[];
  canDismiss = false;

  presentingElement: Element | null = null;

  constructor(
    private modalController: ModalController,
    private productsService: ProductsService,
    private currentStoreInfoService: CurrentStoreInfoService
  ) {}
  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    this.currentStoreInfoService.getCurrentStoreInfo().subscribe((response) => {
      this.currentStoreInfo = response;
    });
    this.loadCategories();
  }

  loadCategories() {
    console.log('cat');
    if (!this.currentStoreInfo?._id) {
      return;
    }
    console.log('caddt');

    this.productsService
      .getAllStoreCategories(this.currentStoreInfo?._id, {
        page: this.currentPage.toString(),
        pageSize: this.pageSize.toString(),
        sortBy: 'name',
        sortOrder: 'asc',
      })
      .subscribe((response) => {
        console.log(response);
        //@ts-ignore
        if (response.message === 'Success') {
          //@ts-ignore
          console.log(response.body.categories);
          //@ts-ignore
          this.categories = [...this.categories, ...response.body.categories];
        }
      });
    // Make API request to fetch categories using the currentPage and pageSize variables
    // Update the 'categories' array with the response from the API
    // Set 'hasMoreCategories' to true or false depending on whether there are more categories
  }

  loadMoreCategories(event: any) {
    console.log('Hiii');
    if (this.hasMoreCategories) {
      this.currentPage++;
      this.loadCategories(); // Make API request to fetch the next page of categories

      event.target.complete(); // Call this to signal that the asynchronous operation has completed
    } else {
      event.target.disabled = true; // Disable the infinite scroll when there are no more categories
    }
  }

  onCategoryChange(category: CategoryI, event: any) {
    if (event.detail.checked) {
      this.selectedCategories.push(category);
    } else {
      const index = this.selectedCategories.findIndex(
        (c) => c.name === category.name
      );
      if (index !== -1) {
        this.selectedCategories.splice(index, 1);
      }
    }
  }

  onSelectCategories() {
    if (!this.categories) {
      return;
    }
    this.onCloseCategorySelectionModal({ selected: this.selectedCategories });
  }

  onCloseCategorySelectionModal = (data?: { selected: CategoryI[] }) => {
    this.modalController.dismiss(data);
  };

  isCategorySelected(category: CategoryI): boolean {
    return this.selectedCategories.some((c) => c.name === category.name);
  }

  addCategory(category: CategoryI) {
    // Find the index where the new category should be inserted
    const insertIndex = this.categories.findIndex(
      (existingCategory) =>
        category.name.localeCompare(existingCategory.name) < 0
    );

    // If no insert index is found, push the category to the end
    if (insertIndex === -1) {
      this.categories.push(category);
    } else {
      // Insert the category at the appropriate index
      this.categories.splice(insertIndex, 0, category);
    }
  }

  async openCreateCategoryModal() {
    const modal = await this.modalController.create({
      component: CategoryCreationModalComponent,
      componentProps: {},
      backdropDismiss: true,
      cssClass: 'login-modal',
    });
    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        console.log('Modal Data : ' + JSON.stringify(modelData.data));
        this.addCategory(modelData.data.created);
      }
    });
    return await modal.present();
  }
}
