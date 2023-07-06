import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TransactionI } from '../../services/transactions/transactions.service';
import { StoreInfoModel } from 'src/app/store/models/userStoreInfo.models';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoice-template-preview',
  templateUrl: './invoice-template-preview.component.html',
  styleUrls: ['./invoice-template-preview.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class InvoiceTemplatePreviewComponent implements OnInit {
  @Input() invoiceInfo!: InvoiceInfoI;
  trsas = ['asdas', 'asdasd'];
  constructor() {}

  ngOnInit() {}
}

export interface InvoiceInfoI {
  transaction: TransactionI;
  store: StoreInfoModel;
}
