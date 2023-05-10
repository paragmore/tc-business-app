import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DividedPageBuilderComponent } from 'src/app/core/components/divided-page-builder/divided-page-builder.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { CustomersListComponent } from './customers-list/customers-list.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  standalone: true,
  imports:[IonicModule, DividedPageBuilderComponent]
})
export class CustomersComponent  implements OnInit {
  customersListComponent = CustomersListComponent
  customerDetailsComponent = CustomerDetailsComponent
  constructor() { }

  ngOnInit() {}

}
