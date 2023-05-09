import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TransactionCreationFormComponent } from './transaction-creation-form/transaction-creation-form.component';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  standalone: true,
  imports: [TransactionCreationFormComponent, IonicModule, TransactionsListComponent]
})
export class TransactionsComponent  implements OnInit {

  public route!: string;
  private activatedRoute = inject(ActivatedRoute);
  constructor() {}

  ngOnInit() {
    this.route = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

}
