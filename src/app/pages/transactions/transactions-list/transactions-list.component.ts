import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TransactionsListCardComponent } from '../transactions-list-card/transactions-list-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss'],
  standalone: true,
  imports:[IonicModule, CommonModule, TransactionsListCardComponent]
})
export class TransactionsListComponent implements OnInit {
  public transactions: Array<{ transactionId: string; type: string }> = [
    { transactionId: '1', type: 'sale' },
  ];
  constructor(private router: Router) {}

  ngOnInit() {}
  navigateToCreateSales() {
    this.router.navigate(['/transactions/create']);
  }
}
