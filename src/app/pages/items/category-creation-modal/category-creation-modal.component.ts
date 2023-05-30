import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { DialogHeaderComponent } from 'src/app/core/components/dialog-header/dialog-header.component';

@Component({
  selector: 'app-category-creation-modal',
  templateUrl: './category-creation-modal.component.html',
  styleUrls: ['./category-creation-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, DialogHeaderComponent],
})
export class CategoryCreationModalComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  onClose = () => {
    this.modalController.dismiss();
  };
}
