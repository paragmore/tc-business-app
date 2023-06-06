import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PartiesTabType } from '../parties.component';
import { CustomersListComponent } from '../../customers/customers-list/customers-list.component';
import { CustomerDetailsComponent } from '../../customers/customer-details/customer-details.component';
import { SuppliersListComponent } from '../../suppliers/suppliers-list/suppliers-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-parties-list',
  templateUrl: './parties-list.component.html',
  styleUrls: ['./parties-list.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CustomersListComponent,
    SuppliersListComponent,
    CommonModule,
  ],
})
export class PartiesListComponent implements OnInit {
  selectedTab!: PartiesTabType;
  updateSelectedTab: (newTab: PartiesTabType) => void;
  constructor(
    @Inject('selectedTab') selectedTab: PartiesTabType,
    @Inject('updateSelectedTab')
    updateSelectedTab: (newTab: PartiesTabType) => void
  ) {
    console.log('yaha', selectedTab);
    this.selectedTab = selectedTab;
    this.updateSelectedTab = updateSelectedTab;
  }

  updateSelectedListTab(event: any) {
    console.log('here', event);
    this.selectedTab = event.detail.value;
    this.updateSelectedTab(this.selectedTab);
  }

  ngOnInit() {}
}
