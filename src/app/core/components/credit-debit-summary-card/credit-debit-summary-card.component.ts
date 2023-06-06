import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-credit-debit-summary-card',
  templateUrl: './credit-debit-summary-card.component.html',
  styleUrls: ['./credit-debit-summary-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class CreditDebitSummaryCardComponent implements OnInit {
  @Input() creditDebitInput!: CreditDebitSummaryCardInputI;
  constructor() {}

  ngOnInit() {}
}

export interface CreditDebitColI {
  title: string;
  amount: number;
  color?: string;
}

export interface CreditDebitSummaryCardInputI {
  title?: string;
  debit: CreditDebitColI;
  credit: CreditDebitColI;
  ctaButton?: CreditDebitCTAButtonI;
}

export interface CreditDebitCTAButtonI {
  title: string;
  icon: string;
  onClick: () => void;
}
