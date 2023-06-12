import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-basic-party-details',
  templateUrl: './basic-party-details.component.html',
  styleUrls: ['./basic-party-details.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class BasicPartyDetailsComponent implements OnInit {
  @Input() partyDetails!: BasicPartyDetailsInputI;
  constructor() {}

  ngOnInit() {}
  getInitials(): string {
    const name = this.partyDetails.name;
    const initials = name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
    return initials;
  }
}

export interface BasicPartyDetailsInputI {
  avatarUrl?: string;
  name: string;
  subtitle: string;
  amount: {
    title: string;
    value: number;
    color: string;
    prefix?: string;
  };
  onEditClick?: () => void;
}

export type AmountType = 'credit' | 'debit';
