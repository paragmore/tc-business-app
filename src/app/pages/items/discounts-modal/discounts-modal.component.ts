import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { DialogHeaderComponent } from 'src/app/core/components/dialog-header/dialog-header.component';

@Component({
  selector: 'app-discounts-modal',
  templateUrl: './discounts-modal.component.html',
  styleUrls: ['./discounts-modal.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    DialogHeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class DiscountsModalComponent implements OnInit {
  discountForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder
  ) {
    this.discountForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      selection: ['orderQuantity'],
    });
  }

  ngOnInit() {}
  onCloseDiscountsModal = () => {
    this.modalController.dismiss();
  };

  onCreateDiscount() {}
}
