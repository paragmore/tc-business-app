import { Component, Inject, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CustomerDetailsComponent } from '../../customers/customer-details/customer-details.component';
import { SuppliersDetailsComponent } from '../../suppliers/suppliers-details/suppliers-details.component';
import { CommonModule } from '@angular/common';
import { PartyTypeEnum } from 'src/app/core/services/parties/parties.service';

@Component({
  selector: 'app-parties-details',
  templateUrl: './parties-details.component.html',
  styleUrls: ['./parties-details.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CustomerDetailsComponent,
    SuppliersDetailsComponent,
    CommonModule,
  ],
})
export class PartiesDetailsComponent implements OnInit {
  selectedTab!: PartyTypeEnum;
  PartyTypeEnum = PartyTypeEnum;
  constructor(@Inject('selectedTab') selectedTab: PartyTypeEnum) {
    console.log('deatiks yaha', selectedTab);
    this.selectedTab = selectedTab;
  }

  updateSelectedListTab(event: any) {
    console.log('hesdsd re', event);
    this.selectedTab = event.detail.value;
  }

  ngOnInit() {}
}
