import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
  CreditDebitSummaryCardComponent,
  CreditDebitSummaryCardInputI,
} from 'src/app/core/components/credit-debit-summary-card/credit-debit-summary-card.component';
import { TransactionTypeEnum } from 'src/app/core/services/transactions/transactions.service';

@Component({
  selector: 'app-mobile-transactions-list-header',
  templateUrl: './mobile-transactions-list-header.component.html',
  styleUrls: ['./mobile-transactions-list-header.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, CreditDebitSummaryCardComponent],
})
export class MobileTransactionsListHeaderComponent implements OnInit {
  selectedTab!: TransactionTypeEnum;
  @Input() creditDebitSummaryData!: CreditDebitSummaryCardInputI;
  TransactionTypeEnum = TransactionTypeEnum;
  updateSelectedTab: (event: any) => void;
  constructor(
    @Inject('selectedTab') selectedTab: TransactionTypeEnum,
    @Inject('creditDebitSummaryData')
    creditDebitSummaryData: CreditDebitSummaryCardInputI,
    @Inject('updateSelectedTab') updateSelectedTab: (event: any) => void
  ) {
    this.selectedTab = selectedTab;
    this.creditDebitSummaryData = creditDebitSummaryData;
    this.updateSelectedTab = updateSelectedTab;
    console.log('CreditDebitSummaryCardInputI', creditDebitSummaryData);
  }

  ngOnInit() {}
}
