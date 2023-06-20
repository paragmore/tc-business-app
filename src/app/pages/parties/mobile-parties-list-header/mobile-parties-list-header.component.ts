import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
  CreditDebitSummaryCardComponent,
  CreditDebitSummaryCardInputI,
} from 'src/app/core/components/credit-debit-summary-card/credit-debit-summary-card.component';
import { PartyTypeEnum } from 'src/app/core/services/parties/parties.service';

@Component({
  selector: 'app-mobile-parties-list-header',
  templateUrl: './mobile-parties-list-header.component.html',
  styleUrls: ['./mobile-parties-list-header.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, CreditDebitSummaryCardComponent],
})
export class MobilePartiesListHeaderComponent implements OnInit {
  selectedTab!: PartyTypeEnum;
  @Input() creditDebitSummaryData!: CreditDebitSummaryCardInputI;
  PartyTypeEnum = PartyTypeEnum;
  constructor(
    @Inject('selectedTab') selectedTab: PartyTypeEnum,
    @Inject('creditDebitSummaryData')
    creditDebitSummaryData: CreditDebitSummaryCardInputI
  ) {
    this.selectedTab = selectedTab;
    this.creditDebitSummaryData = creditDebitSummaryData;
    console.log('CreditDebitSummaryCardInputI', creditDebitSummaryData);
  }

  ngOnInit() {}

  updateSelectedTab(event: any) {}
}
