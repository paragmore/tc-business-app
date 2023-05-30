import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CategoryCreationModalComponent } from '../category-creation-modal/category-creation-modal.component';

@Component({
  selector: 'app-category-selection-modal',
  templateUrl: './category-selection-modal.component.html',
  styleUrls: ['./category-selection-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class CategorySelectionModalComponent implements OnInit {
  categories: CategoryI[] | undefined = [
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },

    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
    {
      name: 'Copsadn',
      description: 'asdasda sdfsafda asd',
      storeId: 'asdasdasdas  ',
      slug: 'asdasd',
    },
  ];
  canDismiss = false;

  presentingElement: Element | null = null;

  constructor(private modalController: ModalController) {}
  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
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
}
