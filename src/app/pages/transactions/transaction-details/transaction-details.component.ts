import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class TransactionDetailsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
