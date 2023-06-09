import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {
  BasicPartyDetailsComponent,
  BasicPartyDetailsInputI,
} from 'src/app/basic-party-details/basic-party-details.component';
import {
  EntriesLedgerDataI,
  EntriesLedgerItemI,
  EntriesLedgerListComponent,
} from 'src/app/core/components/entries-ledger-list/entries-ledger-list.component';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    BasicPartyDetailsComponent,
    EntriesLedgerListComponent,
  ],
})
export class CustomerDetailsComponent implements OnInit {
  currentCustomerId: string | undefined;
  private activatedRoute = inject(ActivatedRoute);
  dummyPartyDetails: BasicPartyDetailsInputI = {
    // avatarUrl: 'https://example.com/avatar.jpg',
    name: 'John Doe',
    subtitle: 'Party Subtitle',
    amount: {
      title: 'Total Amount',
      value: 1000,
      color: '#FF0000',
      prefix: "You'll get",
    },
  };

  // Define dummy data
  dummyData: EntriesLedgerDataI = {
    ledgerItems: [
      {
        col1: {
          text: 'Item 1',
          subtext: 'Subtext 1',
          color: 'red',
        },
        col2: {
          text: 'Item 2',
          subtext: 'Subtext 2',
          color: 'blue',
        },
        col3: {
          text: 'Item 3',
          subtext: 'Subtext 3',
          color: 'green',
        },
        onClick: (ledger: EntriesLedgerItemI) => {
          // Handle onClick logic here
          console.log('Clicked on ledger item:', ledger);
        },
        openItemDetailsPage: (ledger: EntriesLedgerItemI) => {
          // Handle openItemDetailsPage logic here
          console.log('Opened item details page for ledger:', ledger);
        },
      },
      // Add more ledger items as needed
    ],
    onSort: () => {
      // Handle onSort logic here
      console.log('Sorting...');
    },
    isLoading: false,
    currentPage: 1,
    totalPages: 5,
    goToPage: (event: any) => {
      // Handle goToPage logic here
      console.log('Go to page:', event.target.value);
    },
    changePageSize: (event: any) => {
      // Handle changePageSize logic here
      console.log('Change page size:', event.target.value);
    },
    col1Title: 'Column 1',
    col2Title: 'Column 2',
    col3Title: 'Column 3',
  };

  constructor() {}

  ngOnInit() {
    this.currentCustomerId = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as string;
  }
}
