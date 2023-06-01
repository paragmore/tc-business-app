import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { ItemCreationComponent } from '../item-creation/item-creation.component';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
  standalone: true,
  imports: [IonicModule, ItemCreationComponent],
})
export class ItemDetailsComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async openEditProductModal() {
    const modal = await this.modalController.create({
      component: ItemCreationComponent,
      componentProps: {
        editProduct: {
          name: 'parags prd',
        },
      },
      backdropDismiss: true,
      cssClass: 'side-modal',
    });

    modal.onDidDismiss().then((modalData) => {});
    return await modal.present();
  }
}
