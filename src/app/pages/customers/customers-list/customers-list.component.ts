import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
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
  ],
})
export class CustomersListComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  onViewReportsClicked() {}
}
