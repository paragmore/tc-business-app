import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
  DiscountI,
  TransactionI,
  TransactionTypeEnum,
} from '../../services/transactions/transactions.service';
import { StoreInfoModel } from 'src/app/store/models/userStoreInfo.models';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { NumberToWordsPipe } from '../../pipes/number-to-words.pipe';

@Component({
  selector: 'app-invoice-template-preview',
  templateUrl: './invoice-template-preview.component.html',
  styleUrls: ['./invoice-template-preview.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DateFormatPipe,
    NumberToWordsPipe,
  ],
})
export class InvoiceTemplatePreviewComponent implements OnInit {
  @Input() invoiceInfo!: InvoiceInfoI;
  TransactionTypeEnum = TransactionTypeEnum;
  trsas = ['asdas', 'asdasd'];
  constructor() {}

  ngOnInit() {}

  getGSTFormatString(gst: number) {
    return '' + gst / 2 + '( ' + gst / 2 + '% )';
  }

  calculateAmount(
    sellsPrice: number,
    quantity: number,
    taxIncluded: boolean | undefined,
    gstPercentage: number | undefined,
    cess: number | undefined,
    discount: DiscountI | undefined | null
  ) {
    let amount = sellsPrice * quantity;
    let tax = 0;
    if (gstPercentage) {
      tax = (amount * gstPercentage) / 100;
    }
    if (cess) {
      tax = tax + (amount * cess) / 100;
    }
    if (!taxIncluded) {
      amount = amount + tax;
    }
    if (discount) {
      const calculatedDiscount = this.getDiscountAmount(
        discount,
        sellsPrice * quantity
      );
      amount = amount - calculatedDiscount;
    }
    return amount;
  }

  getDiscountAmount(discount: DiscountI, amount: number) {
    let calculatedDiscount = 0;
    if (discount.type === 'percentage') {
      const newDiscount = (amount * discount.value) / 100;
      if (discount.maxDiscount && newDiscount > discount.maxDiscount) {
        calculatedDiscount = discount.maxDiscount;
      } else {
        calculatedDiscount = newDiscount;
      }
    }
    if (discount.type === 'amount') {
      calculatedDiscount = discount.value;
    }
    return calculatedDiscount;
  }
}

export interface InvoiceInfoI {
  transaction: TransactionI;
  store: StoreInfoModel;
}
