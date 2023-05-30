import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CategoryCreationModalComponent } from '../category-creation-modal/category-creation-modal.component';
import { DialogHeaderComponent } from 'src/app/core/components/dialog-header/dialog-header.component';

@Component({
  selector: 'app-category-selection-modal',
  templateUrl: './category-selection-modal.component.html',
  styleUrls: ['./category-selection-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, DialogHeaderComponent],
})
export class CategorySelectionModalComponent implements OnInit {
  categories: CategoryI[] | undefined = [
    {
      name: 'Copsaassdn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
      _id: 'akjshfdiasfbkda',
    },
    {
      name: 'Copssdsdadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
      _id: 'akjshfdiasfbkda',
    },
    {
      name: 'asdasfCopsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
      _id: 'akjshfdiasfbkda',
    },
    {
      name: 'ffdsfgcbvCopsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
      _id: 'akjshfdiasfbkda',
    },
  ];

  @Input() selectedCategories!: CategoryI[];
  canDismiss = false;

  presentingElement: Element | null = null;

  constructor(private modalController: ModalController) {}
  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
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

  async openCreateCategoryModal() {
    const modal = await this.modalController.create({
      component: CategoryCreationModalComponent,
      componentProps: {},
      backdropDismiss: true,
      cssClass: 'login-modal',
    });
    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        // this.modelData = modelData.data;
        // console.log('Modal Data : ' + modelData.data);
      }
    });
    return await modal.present();
  }
}

export interface CategoryI {
  name: string;
  description: string;
  storeId: string;
  slug: string;
  _id: string;
}
