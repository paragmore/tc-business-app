import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-transactions-list-card',
  templateUrl: './transactions-list-card.component.html',
  styleUrls: ['./transactions-list-card.component.scss'],
  standalone: true,
  imports:[IonicModule]
})
export class TransactionsListCardComponent  implements OnInit {

  @Input() transactionDetails: { transactionId: string; type: string; } | undefined
  constructor() { }

  ngOnInit() {}

}
