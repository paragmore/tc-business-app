import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CustomersListComponent } from '../../customers/customers-list/customers-list.component';
import { CustomerDetailsComponent } from '../../customers/customer-details/customer-details.component';
import { SuppliersListComponent } from '../../suppliers/suppliers-list/suppliers-list.component';
import { CommonModule } from '@angular/common';
import { PartyCreationModalComponent } from '../party-creation-modal/party-creation-modal.component';
import { PartyTypeEnum } from 'src/app/core/services/parties/parties.service';

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
  selectedTab!: PartyTypeEnum;
  PartyTypeEnum = PartyTypeEnum;
  updateSelectedTab: (newTab: PartyTypeEnum) => void;
  constructor(
    private modalController: ModalController,
    @Inject('selectedTab') selectedTab: PartyTypeEnum,
    @Inject('updateSelectedTab')
    updateSelectedTab: (newTab: PartyTypeEnum) => void
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
