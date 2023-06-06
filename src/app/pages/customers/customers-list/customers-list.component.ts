import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
  CreditDebitLedgerListComponent,
  LedgerDataI,
  LedgerItemI,
} from 'src/app/core/components/credit-debit-ledger-list/credit-debit-ledger-list.component';
import { CreditDebitSummaryCardComponent } from 'src/app/core/components/credit-debit-summary-card/credit-debit-summary-card.component';
import { SearchFilterSortComponent } from 'src/app/core/components/search-filter-sort/search-filter-sort.component';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CreditDebitSummaryCardComponent,
    SearchFilterSortComponent,
    CreditDebitLedgerListComponent,
  ],
})
export class CustomersListComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  onViewReportsClicked() {}

  dummyLedgerData: LedgerDataI = {
    ledgerItems: [
      {
        title: 'Item 1',
        subTitle: 'Sub Title 1',
        chipText: 'Chip 1',
        amount: '100',
        amountSubtitle: 'Amount Subtitle 1',
        imageUrl: 'https://www.chanchao.com.tw/images/default.jpg',
        onClick: (ledger: LedgerItemI) => {
          // Handle click event for Item 1
        },
        openItemDetailsPage: (ledger: LedgerItemI) => {
          // Handle opening item details page for Item 1
        },
      },
      {
        title: 'Item 2',
        subTitle: 'Sub Title 2',
        chipText: 'Chip 2',
        amount: '200',
        amountSubtitle: 'Amount Subtitle 2',
        imageUrl: 'https://www.chanchao.com.tw/images/default.jpg',
        onClick: (ledger: LedgerItemI) => {
          // Handle click event for Item 2
        },
        openItemDetailsPage: (ledger: LedgerItemI) => {
          // Handle opening item details page for Item 2
        },
      },
      // Add more ledger items as needed
    ],
    onAmountSort: () => {
      // Handle amount sorting
    },
    isLoading: false,
    currentPage: 1,
    totalPages: 10,
    goToPage: (event: any) => {
      // Handle going to a specific page
    },
    changePageSize: (event: any) => {
      // Handle changing page size
    },
    col1Title: 'Name',
    col2Title: 'Amount',
  };
}
