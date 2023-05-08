// sales-creation-form.component.ts

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-sales-creation-form',
  templateUrl: './sales-creation-form.component.html',
  styleUrls: ['./sales-creation-form.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule],
})
export class SalesCreationFormComponent {
  salesForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.salesForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.salesForm = this.fb.group({
      salesItems: this.fb.array([this.createSalesItem()]),
      customerName: ['', Validators.required],
      productName: ['', Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
    });
  }

  createSale() {
    // Handle sale creation logic here
  }

  createSalesItem(): FormGroup {
    return this.fb.group({
      slNo: ['', Validators.required],
      items: ['', Validators.required],
      hsnSac: ['', Validators.required],
      quantity: [0, Validators.required],
      unit1: ['', Validators.required],
      sellingPrice: [0, Validators.required],
      rate: [0, Validators.required],
      discount: [0, Validators.required],
      unit2: ['', Validators.required],
      gst: [0, Validators.required],
      amount1: [0, Validators.required],
      amount2: [0, Validators.required],
    });
  }

  get getFormControls() {
    const control = this.salesForm.get('salesItems') as FormArray;
    console.log('control', control);
    return control;
  }

  addItem(): void {
    const salesItems = this.salesForm.get('salesItems') as FormArray;
    salesItems.push(this.createSalesItem());
  }

  removeItem(index: number): void {
    const salesItems = this.salesForm.get('salesItems') as FormArray;
    salesItems.removeAt(index);
  }
}
