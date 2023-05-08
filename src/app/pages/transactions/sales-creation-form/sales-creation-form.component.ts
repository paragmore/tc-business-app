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
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ScreenModel } from 'src/app/store/models/screen.models';
import { AppState } from 'src/app/store/models/state.model';
@Component({
  selector: 'app-sales-creation-form',
  templateUrl: './sales-creation-form.component.html',
  styleUrls: ['./sales-creation-form.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule],
})
export class SalesCreationFormComponent {
  salesForm: FormGroup;
  public screenState$: Observable<ScreenModel> | undefined;

  constructor(private fb: FormBuilder, private store: Store<AppState>) {
    this.salesForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.salesForm = this.fb.group({
      salesItems: this.fb.array([this.createSalesItem()]),
      customerName: ['', Validators.required],
      // phoneNumber: ['', Validators.required],
      // customerGSTIN: ['', Validators.required],
      // invoiceNumber: ['', Validators.required],
      // invoiceDate: ['', Validators.required],
      // storeGSTIN: ['', Validators.required],
      // state: ['', Validators.required],
      // partyDetails: this.createPartyFormGroup(),
      // invoiceDetails: this.createInvoiceFormGroup(),
    });
    this.screenState$ = this.store.select((store) => store.screen);
  }

  createSale() {
    // Handle sale creation logic here
  }

  // createPartyFormGroup(): FormGroup {
  //   return this.fb.group({
  //     customerName: ['', Validators.required],
  //     phoneNumber: ['', Validators.required],
  //     customerGSTIN: ['', Validators.required],
  //   });
  // }

  // createInvoiceFormGroup(): FormGroup {
  //   return this.fb.group({
  //     invoiceNumber: ['', Validators.required],
  //     invoiceDate: ['', Validators.required],
  //     storeGSTIN: ['', Validators.required],
  //     state: ['', Validators.required],
  //   });
  // }

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
