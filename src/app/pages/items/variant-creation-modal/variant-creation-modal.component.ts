import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { DialogHeaderComponent } from 'src/app/core/components/dialog-header/dialog-header.component';

@Component({
  selector: 'app-variant-creation-modal',
  templateUrl: './variant-creation-modal.component.html',
  styleUrls: ['./variant-creation-modal.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    DialogHeaderComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class VariantCreationModalComponent implements OnInit {
  variantForm: FormGroup;

  constructor(
    private modalContoller: ModalController,
    private formBuilder: FormBuilder
  ) {
    this.variantForm = this.formBuilder.group({
      variantOptions: this.formBuilder.array([this.createVariantItem()]),
    });
  }

  get variantOptions() {
    const control = this.variantForm.get('variantOptions') as FormArray;
    console.log('control', control);
    return control;
  }

  removeItem(index: number): void {
    const variantOptions = this.variantForm.get('variantOptions') as FormArray;
    variantOptions.removeAt(index);
  }

  createVariantItem(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      options: ['', Validators.required],
    });
  }

  ngOnInit() {}

  onCloseVariantModal = () => {
    this.modalContoller.dismiss();
  };

  createVariants() {
    console.log(this.variantForm);
  }

  addOption(): void {
    const variantOptions = this.variantForm.get('variantOptions') as FormArray;
    variantOptions.push(this.createVariantItem());
  }
}
