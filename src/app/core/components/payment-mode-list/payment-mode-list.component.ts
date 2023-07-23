import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-payment-mode-list',
  templateUrl: './payment-mode-list.component.html',
  styleUrls: ['./payment-mode-list.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class PaymentModeListComponent implements OnInit {
  @Output() onSelect: EventEmitter<PaymentModesList> =
    new EventEmitter<PaymentModesList>();
  paymentModesList = Object.values(PaymentModesList);
  constructor() {}

  onSelectEvent(event: PaymentModesList) {
    if (event) {
      this.onSelect.emit(event);
    }
  }

  ngOnInit() {}
}

export enum PaymentModesList {
  BANK_REMITTANCE = 'Bank Remittance',
  BANK_TRANSFER = 'Bank Transfer',
  CASH = 'Cash',
  CHECK = 'Check',
  CREDIT_CARD = 'Credit Card',
}
