import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-gst-type-list',
  templateUrl: './gst-type-list.component.html',
  styleUrls: ['./gst-type-list.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class GstTypeListComponent implements OnInit {
  @Output() onSelect: EventEmitter<GSTTypeI> = new EventEmitter<GSTTypeI>();
  gstTypeList = GST_TYPE_LIST;
  constructor() {}

  onSelectEvent(event: GSTTypeI) {
    if (event) {
      this.onSelect.emit(event);
    }
  }

  ngOnInit() {}
}

export enum GSTTypeEnum {
  REGISTERED = 'REGISTERED',
  REGISTERED_COMPOSITION = 'REGISTERED_COMPOSITION',
  UNREGISTERED = 'UNREGISTERED',
  CONSUMER = 'CONSUMER',
  OVERSEAS = 'OVERSEAS',
  SPECIAL_ECONOMIC_ZONE = 'SPECIAL_ECONOMIC_ZONE',
  DEEMED_EXPORT = 'DEEMED_EXPORT',
  TAX_DEDUCTOR = 'TAX_DEDUCTOR',
  SEZ_DEVELOPER = 'SEZ_DEVELOPER',
}

export interface GSTTypeI {
  title: string;
  subtitle: string;
  isGstin: boolean;
  enumValue: GSTTypeEnum;
}

export const GST_TYPE_LIST: Array<GSTTypeI> = [
  {
    title: 'Registered Business - Regular',
    subtitle: 'Business that is registered under GST',
    isGstin: true,
    enumValue: GSTTypeEnum.REGISTERED,
  },
  {
    title: 'Registered Business - Composition',
    subtitle: 'Business that is registered under the Composition Scheme GST',
    isGstin: true,
    enumValue: GSTTypeEnum.REGISTERED_COMPOSITION,
  },
  {
    title: 'Unregistered Business',
    subtitle: 'Business that has not been registered under GST',
    isGstin: false,
    enumValue: GSTTypeEnum.UNREGISTERED,
  },
  {
    title: 'Consumer',
    subtitle: 'A consumer who is a regular consumer',
    isGstin: false,
    enumValue: GSTTypeEnum.CONSUMER,
  },
  {
    title: 'Overseas',
    subtitle:
      'Persons with whom you do import or export of supplies outside India',
    isGstin: false,
    enumValue: GSTTypeEnum.OVERSEAS,
  },
  {
    title: 'Special Economic Zone',
    subtitle:
      'Business (Unit) that is located in a Special Economic Zone (SEZ) of India or a SEZ Developer',
    isGstin: true,
    enumValue: GSTTypeEnum.SPECIAL_ECONOMIC_ZONE,
  },
  {
    title: 'Deemed Export',
    subtitle:
      'Supply of goods to an Export Oriented Unit or against Advanced Authorization/Export Promotion Capital Goods',
    isGstin: true,
    enumValue: GSTTypeEnum.DEEMED_EXPORT,
  },
  {
    title: 'Tax Deductor',
    subtitle:
      'Departments of State/Central government, governmental agencies or local authorities',
    isGstin: true,
    enumValue: GSTTypeEnum.TAX_DEDUCTOR,
  },
  {
    title: 'SEZ Developer',
    subtitle:
      'A person/organization who owns at least 26% of the equity in creating business units in Special Economic Zone (SEZ)',
    isGstin: true,
    enumValue: GSTTypeEnum.SEZ_DEVELOPER,
  },
];
