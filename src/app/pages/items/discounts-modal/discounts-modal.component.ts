import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { DialogHeaderComponent } from 'src/app/core/components/dialog-header/dialog-header.component';

@Component({
  selector: 'app-discounts-modal',
  templateUrl: './discounts-modal.component.html',
  styleUrls: ['./discounts-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, DialogHeaderComponent],
})
export class DiscountsModalComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}
  onCloseDiscountsModal = () => {
    this.modalController.dismiss();
  };
}
