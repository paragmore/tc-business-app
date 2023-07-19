import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonicModule,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { DialogHeaderComponent } from 'src/app/core/components/dialog-header/dialog-header.component';
import { TaxPreferenceEnum } from 'src/app/core/services/products/products.service';

@Component({
  selector: 'app-tax-popover',
  templateUrl: './tax-popover.component.html',
  styleUrls: ['./tax-popover.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, DialogHeaderComponent],
})
export class TaxPopoverComponent implements OnInit {
  @Input() taxPopoverInput!: TaxPopoverComponentInputI;
  TaxTypeEnum = TaxTypeEnum;
  itemList: string[] = [];
  taxPreferenceList = Object.values(TaxPreferenceEnum).filter(
    (value) => value !== TaxPreferenceEnum.TAXABLE
  );

  gstList: string[] = [
    'GST @ 12%',
    'GST @ 18%',
    'GST @ 28%',
    'GST @ 0%',
    'GST @ 0.1%',
    'GST @ 0.25%',
    'GST @ 3%',
    'GST @ 5%',
    'GST @ 6%',
    'GST @ 7.5%',
  ];

  cessList: string[] = [
    'Cess @ 15%',
    'Cess @ 20%',
    'Cess @ 0%',
    'Cess @ 0.5%',
    'Cess @ 1%',
    'Cess @ 3%',
    'Cess @ 40%',
  ];
  newItem: string | undefined;

  constructor(public popoverController: ModalController) {}

  ngOnInit() {
    if (this.taxPopoverInput.type === TaxTypeEnum.GST) {
      this.itemList = this.gstList;
    }
    if (this.taxPopoverInput.type === TaxTypeEnum.CESS) {
      this.itemList = this.cessList;
    }
  }

  onClosePopover = () => {
    this.popoverController.dismiss();
  };
  selectItem(item: string) {
    this.popoverController.dismiss({ selectedValue: item });
  }

  selectTaxPreference(item: TaxPreferenceEnum) {
    this.popoverController.dismiss({ selectedTaxPreference: item });
  }

  addItem() {
    if (this.newItem) {
      this.itemList.push(this.newItem);
      this.popoverController.dismiss({
        selectedValue:
          this.taxPopoverInput.type === TaxTypeEnum.GST
            ? `GST @ ${this.newItem} %`
            : this.taxPopoverInput.type === TaxTypeEnum.CESS
            ? `Cess @ ${this.newItem} %`
            : ``,
      });
    }
  }
}

export enum TaxTypeEnum {
  CESS = 'cess',
  GST = 'GST',
}

export interface TaxPopoverComponentInputI {
  type: TaxTypeEnum;
}
