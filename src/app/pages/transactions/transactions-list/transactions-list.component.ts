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
  imports: [IonicModule, CommonModule, TransactionsListCardComponent],
})
export class TransactionsListComponent implements OnInit {
  public transactions: Array<{
    transactionId: string;
    type: string;
    customerName: string;
    amount: number;
    modeOfPayment: string;
    timeStamp: string;
  }> = [
    {
      transactionId: '1',
      type: 'sale',
      amount: 1000,
      customerName: 'Parag',
      modeOfPayment: 'Online',
      timeStamp: '09 May 2023',
    },
    {
      transactionId: '2',
      type: 'purchare',
      amount: 100,
      customerName: 'Store',
      modeOfPayment: 'Cash',
      timeStamp: '08 May 2023',
    },
    {
      transactionId: '3',
      type: 'sale',
      amount: 5000,
      customerName: 'Parag',
      modeOfPayment: 'Online',
      timeStamp: '09 May 2023',
    },
  ];
  constructor(private router: Router) {}

  ngOnInit() {}
  navigateToCreateSales() {
    this.router.navigate(['/transactions/create']);
  }
}
