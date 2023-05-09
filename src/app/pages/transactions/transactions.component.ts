import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DividedPageBuilderComponent } from 'src/app/core/components/divided-page-builder/divided-page-builder.component';
import { TransactionCreationFormComponent } from './transaction-creation-form/transaction-creation-form.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  standalone: true,
  imports: [
    TransactionCreationFormComponent,
    IonicModule,
    TransactionsListComponent,
    DividedPageBuilderComponent,
    TransactionDetailsComponent,
  ],
})
export class TransactionsComponent implements OnInit {
  transactionsListComponent = TransactionsListComponent;
  transactionDetailsComponent = TransactionDetailsComponent
  public route!: string;
  private activatedRoute = inject(ActivatedRoute);
  constructor() {}

  ngOnInit() {
    this.route = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }
}
