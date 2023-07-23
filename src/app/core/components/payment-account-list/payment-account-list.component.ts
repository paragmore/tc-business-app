import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-payment-account-list',
  templateUrl: './payment-account-list.component.html',
  styleUrls: ['./payment-account-list.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class PaymentAccountListComponent implements OnInit {
  @Output() onSelect: EventEmitter<string> = new EventEmitter<string>();

  paymentAccountsTypeList = Object.keys(PAYMENT_ACCOUNTS_LIST);
  constructor() {}

  getPaymentAccountsArray(paymentAccountlistType: string) {
    //@ts-ignore
    return PAYMENT_ACCOUNTS_LIST[paymentAccountlistType];
  }

  onSelectEvent(event: string) {
    if (event) {
      this.onSelect.emit(event);
    }
  }

  ngOnInit() {}
}
export enum PaymentAccountsListTypesEnum {
  BANK = 'Bank',
  CASH = 'Cash',
  OTHER_CURRENT_LIABILITY = 'Other Current Liability',
}

export enum PaymentAccountsListEnum {}

export enum CashAccountsListEnum {
  PETTY_CASH = 'Petty Cash',
  UNDEPOSITED_FUNDS = 'Undeposited Funds',
}

export enum OtherCurrentLiabilityAccountsListEnum {
  EMPLOYEE_REIMBURSEMENTS = 'Employee Reimbursements',
  OPENING_BALANCE_ADJUSTMENTS = 'Opening Balance Adjustments',
  TDS_PAYABLE = 'TDS Payable',
}

export const PAYMENT_ACCOUNTS_LIST = {
  [PaymentAccountsListTypesEnum.CASH]: Object.values(CashAccountsListEnum),
  [PaymentAccountsListTypesEnum.OTHER_CURRENT_LIABILITY]: Object.values(
    OtherCurrentLiabilityAccountsListEnum
  ),
};
