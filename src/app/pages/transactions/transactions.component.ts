import { Component, OnInit } from '@angular/core';
import { SalesCreationFormComponent } from './sales-creation-form/sales-creation-form.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  standalone: true,
  imports: [SalesCreationFormComponent]
})
export class TransactionsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
