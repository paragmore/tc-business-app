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
    const words = name.split(' ');

    let initials = '';
    for (let i = 0; i < Math.min(2, words.length); i++) {
      const word = words[i];
      initials += word.charAt(0).toUpperCase();
    }

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
