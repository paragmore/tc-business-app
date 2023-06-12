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
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private currentStoreInfoService: CurrentStoreInfoService,
    private partiesService: PartiesService,
    private toastController: ToastController
  ) {
    this.partyForm = this.formBuilder.group({
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
    }
    if (this.editParty && '_id' in this.editParty) {
      this.partyForm.patchValue({ ...this.editParty });
    }
  }

  async createOrUpdateParty() {
    console.log(this.partyForm.value);
    //@ts-ignore
    console.log(this.partyForm.value, this.currentStoreInfo?._id);
    if (!this.currentStoreInfo || !this.currentStoreInfo._id) {
      return;
    }
    const partyFormValue = this.partyForm.value as PartyFormValueI;
    if (this.editParty) {
      const updatePartyPayload: UpdatePartyRequestI = {
        ...partyFormValue,
        storeId: this.currentStoreInfo._id,
        type: this.partyType,
        partyId: this.partyId,
      };
      this.updateProduct(updatePartyPayload);
    } else {
      const createProductPayload: CreatePartyRequestI = {
        ...partyFormValue,
        storeId: this.currentStoreInfo._id,
        type: this.partyType,
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
