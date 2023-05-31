import { Component, OnInit } from '@angular/core';
import {
  CheckboxCustomEvent,
  IonicModule,
  ModalController,
} from '@ionic/angular';
import { CategorySelectionModalComponent } from '../category-selection-modal/category-selection-modal.component';
import { CategoryI } from 'src/app/core/services/products/products.service';
import { DiscountsModalComponent } from '../discounts-modal/discounts-modal.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-item-creation',
  templateUrl: './item-creation.component.html',
  styleUrls: ['./item-creation.component.scss'],
  standalone: true,
  imports: [IonicModule, CategorySelectionModalComponent],
})
export class ItemCreationComponent implements OnInit {
  canDismiss = false;

  presentingElement: Element | null = null;
  selectedCategoryIds: string[] = [];
  selectedCategories: CategoryI[] = [];
  selectedCategoriesString: string = '';
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
  }

  onTermsChanged(event: Event) {
    const ev = event as CheckboxCustomEvent;
    this.canDismiss = ev.detail.checked;
  }

  async openDiscountsMoadal() {
    const modal = await this.modalController.create({
      component: DiscountsModalComponent,
      componentProps: { selectedCategories: this.selectedCategories },
      backdropDismiss: true,
      cssClass: 'login-modal',
    });
  }

  async openCreateCategoryModal() {
    this.selectedCategoriesString = '';
    const modal = await this.modalController.create({
      component: CategorySelectionModalComponent,
      componentProps: { selectedCategories: this.selectedCategories },
      backdropDismiss: true,
      cssClass: 'login-modal',
    });
    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        // this.modelData = modelData.data;
        console.log('Modal Data : ' + JSON.stringify(modelData.data));
        if (modelData?.data?.selected?.length > 0) {
          this.selectedCategories = modelData?.data?.selected;
        }
      }
      this.selectedCategories.map((category: CategoryI) => {
        this.selectedCategoryIds.push(category._id);
        this.selectedCategoriesString =
          this.selectedCategoriesString + ' , ' + category.name;
      });
    });
    return await modal.present();
  }
}
