import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CategoryCreationModalComponent } from '../category-creation-modal/category-creation-modal.component';
import { DialogHeaderComponent } from 'src/app/core/components/dialog-header/dialog-header.component';
import {
  CategoryI,
  ProductsService,
} from 'src/app/core/services/products/products.service';
import { CurrentStoreInfoService } from 'src/app/core/services/currentStore/current-store-info.service';
import { StoreInfoModel } from 'src/app/store/models/userStoreInfo.models';
import { toastAlert } from 'src/app/core/utils/toastAlert';
import { ConfirmationModalComponent } from 'src/app/core/components/confirmation-modal/confirmation-modal.component';

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
  modalSelectedCategories: CategoryI[] = [];
  canDismiss = false;

  presentingElement: Element | null = null;
  isDeleteMode = false;

  constructor(
    private modalController: ModalController,
    private productsService: ProductsService,
    private currentStoreInfoService: CurrentStoreInfoService,
    private toastController: ToastController
  ) {}
  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    this.currentStoreInfoService.getCurrentStoreInfo().subscribe((response) => {
      this.currentStoreInfo = response;
    });
    this.loadCategories();
    this.modalSelectedCategories = [...this.selectedCategories];
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
    if (!this.isDeleteMode) {
      this.modalSelectedCategories = [];
    }
    if (event.detail.checked) {
      this.modalSelectedCategories.push(category);
    } else {
      const index = this.modalSelectedCategories.findIndex(
        (c) => c.name === category.name
      );
      if (index !== -1) {
        this.modalSelectedCategories.splice(index, 1);
      }
    }
  }

  onSelectCategories() {
    if (!this.categories) {
      return;
    }
    this.selectedCategories = this.modalSelectedCategories;
    this.onCloseCategorySelectionModal({ selected: this.selectedCategories });
  }

  onDeleteModeToggle(isDeleteMode: boolean) {
    this.isDeleteMode = isDeleteMode;
    this.selectedCategories = [];
    this.modalSelectedCategories = [];
  }

  onDeleteCategories(onDeleteSuccessful?: () => {}) {
    if (!this.categories) {
      return;
    }
    const categoryIds = this.modalSelectedCategories.map(
      (category) => category._id
    );
    const storeId = this.currentStoreInfo?._id;
    if (!storeId) {
      return;
    }
    return this.productsService
      .deleteStorecategory(storeId, categoryIds)
      .subscribe({
        next: (response) => {
          //@ts-ignore
          console.log(response?.body);
          this.modalSelectedCategories.map((deletedCategory) =>
            this.deleteItemInListFn(this.categories, deletedCategory)
          );
          if (onDeleteSuccessful) {
            onDeleteSuccessful();
          }
          this.modalSelectedCategories = [];
          toastAlert(this.toastController, 'Categories deleted successfully');
        },
        error: (error) => {},
        complete: () => {},
      });
  }

  deleteItemInListFn(itemsList: Array<CategoryI>, item: CategoryI) {
    const deleteIndex = itemsList.findIndex(
      (listItem) => listItem._id === item._id
    );
    if (deleteIndex) {
      itemsList.splice(deleteIndex, 1);
    }
    return itemsList;
  }

  async openDeleteConfirmationModal() {
    const modal = await this.modalController.create({
      component: ConfirmationModalComponent,
      componentProps: {
        confirmationModalInput: {
          headerTitle: 'Delete categories',
          body: {
            title: 'Are you sure?',
            icon: {
              name: 'close-circle-outline',
              class: 'danger',
            },
            subText:
              'Do you really want to delete these categories? This process cannot be undone',
          },
          ctaButton: {
            text: 'Delete',
            class: 'danger',
            onClick: () => {
              console.log('confirm clicked');
              this.onDeleteCategories(() => modal.dismiss());
            },
          },
        },
      },
      backdropDismiss: true,
      cssClass: 'login-modal',
    });
    modal.onDidDismiss().then((event) => {
      if (event && event.data) {
        console.log('Modal dismissed with data:', event.data);
      }
    });

    modal.onDidDismiss().then((modalData) => {});
    return await modal.present();
  }

  onCloseCategorySelectionModal = (data?: { selected: CategoryI[] }) => {
    this.modalController.dismiss(data);
  };

  isCategorySelected(category: CategoryI): boolean {
    return this.modalSelectedCategories.some((c) => c.name === category.name);
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
