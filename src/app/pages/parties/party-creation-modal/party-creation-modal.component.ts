import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { DialogHeaderComponent } from 'src/app/core/components/dialog-header/dialog-header.component';
import { CurrentStoreInfoService } from 'src/app/core/services/currentStore/current-store-info.service';
import { AppState } from 'src/app/store/models/state.model';
import { PartiesTabType } from '../parties.component';

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
  @Input() editParty: { _id: string } | undefined;
  @Input() partyType!: PartiesTabType;

  partyText = '';
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private currentStoreInfoService: CurrentStoreInfoService
  ) {
    this.partyForm = this.formBuilder.group({
      name: ['', Validators.required],
      phoneNumber: [''],
      email: [''],
      balance: [''],
      gstin: [''],
      address: this.createAddressesFormGroup(),
      purchasePrice: [''],
      taxIncluded: [true, Validators.required],
      hsnCode: [''],
      quantity: ['', Validators.required],
      lowStock: [''],
      gstPercentage: [''],
    });
  }

  onClosePartyCreationModal = () => {
    this.modalController.dismiss();
  };

  createOrUpdateParty() {}

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

  ngOnInit() {
    this.partyText =
      this.partyType === 'customers'
        ? 'Customer'
        : this.partyType === 'suppliers'
        ? 'Supplier'
        : '';
  }
}
