import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
  BasicPartyDetailsComponent,
  BasicPartyDetailsInputI,
} from 'src/app/basic-party-details/basic-party-details.component';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, BasicPartyDetailsComponent],
})
export class CustomerDetailsComponent implements OnInit {
  dummyPartyDetails: BasicPartyDetailsInputI = {
    // avatarUrl: 'https://example.com/avatar.jpg',
    name: 'John Doe',
    subtitle: 'Party Subtitle',
    amount: {
      title: 'Total Amount',
      value: 1000,
      color: '#FF0000',
      prefix: "You'll get",
    },
  };
  constructor() {}

  ngOnInit() {}
}
