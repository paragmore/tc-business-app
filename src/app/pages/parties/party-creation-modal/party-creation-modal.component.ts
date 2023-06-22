import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { DialogHeaderComponent } from 'src/app/core/components/dialog-header/dialog-header.component';
import { CurrentStoreInfoService } from 'src/app/core/services/currentStore/current-store-info.service';
import { AppState } from 'src/app/store/models/state.model';
import {
  AdrressesI,
  CreatePartyRequestI,
  GetAllCustomersResponseI,
  PartiesService,
  PartyTypeEnum,
  SupplierI,
  UpdatePartyRequestI,
} from 'src/app/core/services/parties/parties.service';
import { StoreInfoModel } from 'src/app/store/models/userStoreInfo.models';
import { toastAlert } from 'src/app/core/utils/toastAlert';

@Component({
  selector: 'app-party-creation-modal',
  templateUrl: './party-creation-modal.component.html',
  styleUrls: ['./party-creation-modal.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    DialogHeaderComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class PartyCreationModalComponent implements OnInit {
  partyForm: FormGroup;
  @Input() editParty: GetAllCustomersResponseI | SupplierI | undefined;
  @Input() partyType!: PartyTypeEnum;
  currentStoreInfo: StoreInfoModel | undefined;
  partyId = '';
  partyText = '';
  selectedGSTType: GSTTypeI | undefined;
  gstTypeList: Array<GSTTypeI> = gstTypeList;
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private currentStoreInfoService: CurrentStoreInfoService,
    private partiesService: PartiesService,
    private toastController: ToastController
  ) {
    this.partyForm = this.formBuilder.group({
      gstTypeTitle: ['', Validators.required],
      name: ['', Validators.required],
      phoneNumber: [''],
      email: [''],
      balance: [''],
      gstin: [''],
      address: this.createAddressesFormGroup(),
    });
  }

  ngOnInit() {
    this.currentStoreInfoService.getCurrentStoreInfo().subscribe((response) => {
      this.currentStoreInfo = response;
    });
    this.partyText =
      this.partyType === PartyTypeEnum.CUSTOMER
        ? 'Customer'
        : this.partyType === PartyTypeEnum.SUPPLIER
        ? 'Supplier'
        : '';
    this.partyId =
      this.partyType === PartyTypeEnum.CUSTOMER
        ? //@ts-ignore
          this.editParty?.customer?._id
        : this.partyType === PartyTypeEnum.SUPPLIER
        ? //@ts-ignore
          this.editParty?._id
        : '';
    if (this.editParty && 'customer' in this.editParty) {
      this.partyForm.patchValue({
        ...this.editParty.customerStoreInfo,
        phoneNumber: this.editParty.customer.phoneNumber,
        address: this.editParty.customerStoreInfo.addresses
          ? this.editParty.customerStoreInfo.addresses[0]
          : [],
      });
      this.selectGSTTypeByEnum(this.editParty.customerStoreInfo.gstType);
    }
    if (this.editParty && '_id' in this.editParty) {
      this.partyForm.patchValue({ ...this.editParty });
      this.selectGSTTypeByEnum(this.editParty.gstType);
    }
  }

  async selectGSTTypeByEnum(gstTypeEnum: GSTTypeEnum) {
    const gstType = this.gstTypeList.find(
      (type) => type.enumValue === gstTypeEnum
    );
    if (!gstType) {
      return;
    }
    this.selectedGSTType = gstType;
    this.partyForm.patchValue({ gstTypeTitle: gstType.title });
  }

  async selectGSTType(gstType: GSTTypeI) {
    this.selectedGSTType = gstType;
    this.partyForm.patchValue({ gstTypeTitle: gstType.title });
  }
  async createOrUpdateParty() {
    console.log(this.partyForm.value);
    //@ts-ignore
    console.log(this.partyForm.value, this.currentStoreInfo?._id);
    if (!this.currentStoreInfo || !this.currentStoreInfo._id) {
      return;
    }
    const partyFormValue = this.partyForm.value as PartyFormValueI;
    if (!this.selectedGSTType) {
      return;
    }
    if (this.editParty) {
      const updatePartyPayload: UpdatePartyRequestI = {
        ...partyFormValue,
        storeId: this.currentStoreInfo._id,
        type: this.partyType,
        partyId: this.partyId,
        gstType: this.selectedGSTType?.enumValue,
      };
      this.updateProduct(updatePartyPayload);
    } else {
      const createProductPayload: CreatePartyRequestI = {
        ...partyFormValue,
        storeId: this.currentStoreInfo._id,
        type: this.partyType,
        gstType: this.selectedGSTType?.enumValue,
      };
      this.createProduct(createProductPayload);
    }
  }

  async createProduct(createProductPayload: CreatePartyRequestI) {
    this.partiesService.createParty(createProductPayload).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        toastAlert(this.toastController, error.error.message);
      }
    );
  }

  async updateProduct(updatePartyPayload: UpdatePartyRequestI) {
    this.partiesService.updateParty(updatePartyPayload).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        toastAlert(this.toastController, error.error.message);
      }
    );
  }

  onClosePartyCreationModal = () => {
    this.modalController.dismiss();
  };

  createAddressFormGroup() {
    return this.formBuilder.group({
      line1: [''],
      line2: [''],
      city: [''],
      state: [''],
      pinCode: [''],
    });
  }
  createAddressesFormGroup() {
    return this.formBuilder.group({
      shipping: this.createAddressFormGroup(),
      billingSameAsShipping: [true],
      billing: this.createAddressFormGroup(),
    });
  }
}

export interface PartyFormValueI {
  name: string;
  phoneNumber: string;
  email?: string;
  balance?: number;
  gstin?: string;
  address: AdrressesI;
}

export interface GSTTypeI {
  title: string;
  subtitle: string;
  isGstin: boolean;
  enumValue: GSTTypeEnum;
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

export const gstTypeList: Array<GSTTypeI> = [
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
