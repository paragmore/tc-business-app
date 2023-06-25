import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
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
import { AbsValuePipe } from 'src/app/core/pipes/absolute.pipe';
import {
  OnboardingService,
  VerifyGSTINResponseI,
} from 'src/app/core/services/onboarding/onboarding.service';

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
    AbsValuePipe,
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
  balanceType = 'give';
  verifygstinResponse: VerifyGSTINResponseI | undefined;
  isLoading = false;
  isGSTLoading = false;
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private currentStoreInfoService: CurrentStoreInfoService,
    private partiesService: PartiesService,
    private toastController: ToastController,
    private onboardingService: OnboardingService
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
      if (
        this.editParty &&
        this.editParty.customerStoreInfo.balance &&
        this.editParty.customerStoreInfo.balance > 0
      ) {
        this.balanceType = 'get';
      }
      if (
        this.editParty &&
        this.editParty.customerStoreInfo.balance &&
        this.editParty.customerStoreInfo.balance < 0
      ) {
        this.balanceType = 'give';
      }
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
      console.log('VALUEE', this.editParty);
      if (
        this.editParty &&
        this.editParty.balance &&
        this.editParty.balance > 0
      ) {
        this.balanceType = 'get';
      }
      if (
        this.editParty &&
        this.editParty.balance &&
        this.editParty.balance < 0
      ) {
        this.balanceType = 'give';
      }
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
        balance:
          this.balanceType === 'give'
            ? -Math.abs(this.partyForm.value.balance)
            : Math.abs(this.partyForm.value.balance),
      };
      this.updateProduct(updatePartyPayload);
    } else {
      const createProductPayload: CreatePartyRequestI = {
        ...partyFormValue,
        storeId: this.currentStoreInfo._id,
        type: this.partyType,
        gstType: this.selectedGSTType?.enumValue,
        balance:
          this.balanceType === 'give'
            ? -Math.abs(this.partyForm.value.balance)
            : Math.abs(this.partyForm.value.balance),
      };
      this.createProduct(createProductPayload);
    }
  }

  async onVerifyAndLoadGstInfo() {
    if (!this.currentStoreInfo?._id) {
      return;
    }
    this.isGSTLoading = true;
    this.onboardingService
      .verifyGSTIN(
        this.currentStoreInfo._id,
        this.partyForm.get('gstin')?.value
      )
      .subscribe(
        (response) => {
          console.log(response);
          //@ts-ignore
          this.verifygstinResponse = response.body;

          this.partyForm.patchValue({
            name: this.verifygstinResponse?.lgnm,
            address: {
              shipping: {
                line1: this.verifygstinResponse?.pradr.addr.bnm,
                line2: this.verifygstinResponse?.pradr.adr,
                city:
                  this.verifygstinResponse?.pradr.addr.city +
                  ' ' +
                  this.verifygstinResponse?.pradr.addr.dst,
                state: this.verifygstinResponse?.pradr.addr.stcd,
                pinCode: this.verifygstinResponse?.pradr.addr.pncd,
              },
              billingSameAsShipping: true,
              billing: {
                line1: this.verifygstinResponse?.pradr.addr.bnm,
                line2: this.verifygstinResponse?.pradr.adr,
                city:
                  this.verifygstinResponse?.pradr.addr.city +
                  ' ' +
                  this.verifygstinResponse?.pradr.addr.dst,
                state: this.verifygstinResponse?.pradr.addr.stcd,
                pinCode: this.verifygstinResponse?.pradr.addr.pncd,
              },
            },
          });
        },
        (error) => {
          console.log(error.error.message);
          const errors: ValidationErrors = { error: error.error.message };
          this.partyForm.setErrors(errors);
          toastAlert(this.toastController, error.error.message, 'danger');
        },
        () => {
          this.isGSTLoading = false;
        }
      );
  }

  async createProduct(createProductPayload: CreatePartyRequestI) {
    this.isLoading = true;
    this.partiesService.createParty(createProductPayload).subscribe(
      (response) => {
        console.log(response);
        //@ts-ignore
        if (response.message === 'Success') {
          toastAlert(
            this.toastController,
            `${this.partyType} created successfully`,
            'success'
          );
        }
      },
      (error) => {
        toastAlert(this.toastController, error.error.message, 'danger');
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  async updateProduct(updatePartyPayload: UpdatePartyRequestI) {
    this.isLoading = true;

    this.partiesService.updateParty(updatePartyPayload).subscribe(
      (response) => {
        console.log(response);
        //@ts-ignore
        if (response.message === 'Success') {
          toastAlert(
            this.toastController,
            `${this.partyType} updated successfully`,
            'success'
          );
        }
      },
      (error) => {
        toastAlert(this.toastController, error.error.message, 'danger');
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onBalanceTypeChange(event: any) {
    this.balanceType = event.detail.value;
  }

  updatePositiveBalance(event: any) {
    console.log(event);
    this.partyForm.patchValue({ balance: event.detail.value });
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
