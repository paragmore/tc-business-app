import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CurrentStoreInfoService } from 'src/app/core/services/currentStore/current-store-info.service';
import {
  GetAllCustomersResponseI,
  PartiesService,
  PartyTypeEnum,
  SupplierI,
} from 'src/app/core/services/parties/parties.service';
import {
  CreatePaymentRequestI,
  PaymentModeEnum,
  PaymentStatusEnum,
  PaymentTypeEnum,
  TransactionI,
  TransactionTypeEnum,
  TransactionsService,
} from 'src/app/core/services/transactions/transactions.service';
import { toastAlert } from 'src/app/core/utils/toastAlert';
import { ScreenModel } from 'src/app/store/models/screen.models';
import { AppState } from 'src/app/store/models/state.model';
import { StoreInfoModel } from 'src/app/store/models/userStoreInfo.models';
import { PartyCreationModalComponent } from '../../parties/party-creation-modal/party-creation-modal.component';
import { DialogHeaderComponent } from 'src/app/core/components/dialog-header/dialog-header.component';
import { PartySelectionComponent } from 'src/app/core/components/party-selection/party-selection.component';
import { CapitalizeWordsPipe } from 'src/app/core/pipes/capitalize.pipe';
import { DateFormatPipe } from 'src/app/core/pipes/date-format.pipe';

@Component({
  selector: 'app-payment-creation-form',
  templateUrl: './payment-creation-form.component.html',
  styleUrls: ['./payment-creation-form.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DialogHeaderComponent,
    PartySelectionComponent,
    CapitalizeWordsPipe,
    ReactiveFormsModule,
    DateFormatPipe,
  ],
})
export class PaymentCreationFormComponent implements OnInit {
  paymentForm: FormGroup;
  paymentType!: PaymentTypeEnum;
  @Input() transactionType!: TransactionTypeEnum;

  public screenState$: Observable<ScreenModel> | undefined;
  partyCurrentPage = 1;
  partyTotalPages = 100;
  partyPageSize = 10;
  hasMoreCustomers = true;
  isCustomersLoading = false;
  isProductsLoading = false;
  itemsCurrentPage = 1;
  itemsTotalPages = 100;
  itemsPageSize = 10;
  currentStoreInfo: StoreInfoModel | undefined;
  selectedParty: GetAllCustomersResponseI | SupplierI | undefined;
  isUpdatingForm = false;
  PaymentStatusEnum = PaymentStatusEnum;
  PaymentModeEnum = PaymentModeEnum;
  selectedPartyTab: PartyTypeEnum = PartyTypeEnum.CUSTOMER;
  isLoading = false;
  TransactionTypeEnum = TransactionTypeEnum;
  receivedFullAmt = false;
  unpaidPartyTransactions: TransactionI[] = [];
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private partiesService: PartiesService,
    private currentStoreInfoService: CurrentStoreInfoService,
    private modalController: ModalController,
    private transactionsService: TransactionsService,
    private toastController: ToastController,
    private route: ActivatedRoute
  ) {
    this.paymentForm = this.fb.group({});
  }

  ngOnInit(): void {
    console.log('this.transactionType', this.transactionType);
    this.route.queryParams.subscribe((params) => {
      this.paymentType = params['type'];
      if (this.transactionType === TransactionTypeEnum.SALE) {
        this.selectedPartyTab = PartyTypeEnum.CUSTOMER;
        this.paymentType = PaymentTypeEnum.IN;
      }
      if (this.transactionType === TransactionTypeEnum.PURCHASE) {
        this.selectedPartyTab = PartyTypeEnum.SUPPLIER;
        this.paymentType = PaymentTypeEnum.OUT;
      }
      // Use the values in your component logic
    });
    this.paymentForm = this.fb.group({
      partyId: ['', Validators.required],
      party: this.createPartyFormGroup(),
      paymentType: ['', Validators.required],
      amount: ['', Validators.required],
      date: [new Date(), Validators.required],
      paymentNumber: ['', Validators.required],
      paymentMode: ['', Validators.required],
      paymentAccount: ['', Validators.required],
      taxDeducted: [false, Validators.required],
      taxAccount: [''],
      invoicePayments: this.fb.array([]),
      notes: [''],
    });
    this.currentStoreInfoService.getCurrentStoreInfo().subscribe((response) => {
      this.currentStoreInfo = response;
    });

    this.screenState$ = this.store.select((store) => store.screen);
    this.isUpdatingForm = false;
  }

  onClosePaymentCreationModal = () => {
    this.modalController.dismiss();
  };

  onReceivedAmtToggle = (event: any) => {
    this.receivedFullAmt = event.detail.checked;
  };

  getPartyUnpaidTransactions(partyId: string) {
    if (!this.currentStoreInfo?._id) {
      return;
    }
    this.transactionsService
      .getAllStoreTransactions(this.currentStoreInfo?._id, {
        transactionType: this.transactionType,
        paymentStatus:
          PaymentStatusEnum.UNPAID + ',' + PaymentStatusEnum.PARTIALLY_PAID,
        partyId: partyId,
      })
      .subscribe({
        next: (response) => {
          console.log('UNPAID', response);
          //@ts-ignore
          this.unpaidPartyTransactions = response.body.transactions;
          this.unpaidPartyTransactions.forEach((transaction) => {
            this.addItem(transaction.invoiceId);
          });
        },
        error: (err) => {},
        complete: () => {},
      });
  }

  createPayment() {
    // Handle sale creation logic here
    console.log(this.paymentForm.value);
    if (!this.currentStoreInfo?._id) {
      return;
    }
    const paymentFormValue: {
      partyId: string;
      paymentType: PaymentTypeEnum;
      amount: string;
      date: Date;
      paymentNumber: string;
      paymentMode: string;
      paymentAccount: string;
      taxDeducted: boolean;
      taxAccount?: string;
      invoicePayments: [];
      notes?: string;
    } = this.paymentForm.value;
    const paymentPayload: CreatePaymentRequestI = {
      storeId: this.currentStoreInfo?._id,
      ...paymentFormValue,
      paymentType: this.paymentType,
      partyId: paymentFormValue.partyId,
      amount: 0,
      paymentNumber: 0,
      paymentMode: '',
      paymentAccount: '',
      taxDeducted: false,
      invoicePayments: [],
    };
    console.log(paymentPayload);
    const replaced = this.replaceEmptyObjectsWithUndefined(paymentPayload);
    console.log(replaced);
    this.isLoading = true;
    this.transactionsService.createStorePayment(paymentPayload).subscribe(
      (response) => {
        console.log(response);
        //@ts-ignore
        if (response.message === 'Success') {
          toastAlert(
            this.toastController,
            `${this.paymentType} created successfully`,
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

  getCustomerDetails(party: GetAllCustomersResponseI | SupplierI) {
    if ('customer' in party) {
      return party.customer;
    }
    return party;
  }

  replaceEmptyObjectsWithUndefined(obj: any) {
    for (let key in obj) {
      if (
        typeof obj[key] === 'object' &&
        obj[key] !== null &&
        !Array.isArray(obj[key] && obj[key].length === 0) &&
        !(obj[key] instanceof Date)
      ) {
        this.replaceEmptyObjectsWithUndefined(obj[key]);
        if (Object.values(obj[key]).every((value) => value === '')) {
          obj[key] = undefined;
        }
      }
    }
  }
  removeSelectedParty() {
    this.selectedParty = undefined;
    const partyFormPayload = {
      partyId: '',
      name: '',
      tradeName: '',
      phoneNumber: '',
      email: '',
      gstin: '',
      address: {
        shipping: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          pinCode: '',
        },
        billingSameAsShipping: true,
        billing: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          pinCode: '',
        },
      },
    };
    this.paymentForm.patchValue({
      party: partyFormPayload,
    });
  }

  selectTransactionParty(party: GetAllCustomersResponseI | SupplierI) {
    this.selectedParty = party;
    let partyFormPayload: any;
    if ('customer' in party) {
      partyFormPayload = {
        partyId: party.customerStoreInfo.customerId,
        name: party.customerStoreInfo.name,
        tradeName: party.customerStoreInfo.tradeName,
        phoneNumber: party.customer.phoneNumber,
        email: party.customerStoreInfo.email,
        gstin: party.customerStoreInfo.gstin,
        address: party.customerStoreInfo.addresses
          ? party.customerStoreInfo.addresses[0]
          : undefined,
      };
    } else {
      partyFormPayload = {
        partyId: party._id,
        name: party.name,
        tradeName: party.tradeName,
        phoneNumber: party.phoneNumber,
        email: party.email,
        gstin: party.gstin,
        address: party.addresses ? party.addresses[0] : undefined,
      };
    }
    this.paymentForm.patchValue({
      partyId: partyFormPayload.partyId,
      party: partyFormPayload,
    });
    this.getPartyUnpaidTransactions(partyFormPayload.partyId);
  }

  resetPagination() {
    this.partyCurrentPage = 1;
    this.partyTotalPages = 1;
    this.partyPageSize = 10;
  }

  getPartyDetails(party: GetAllCustomersResponseI | SupplierI) {
    if ('customer' in party) {
      return party.customerStoreInfo;
    }
    return party;
  }

  async openAddPartyModal() {
    const modal = await this.modalController.create({
      component: PartyCreationModalComponent,
      componentProps: { partyType: this.selectedPartyTab },
      backdropDismiss: true,
      cssClass: 'side-modal',
    });

    modal.onDidDismiss().then((modalData) => {});
    return await modal.present();
  }

  getTotalInformation() {
    const totalInfo = {
      subTotal: 0,
      gst: 0,
      cess: 0,
      discounts: 0,
      total: 0,
    };
    this.paymentForm.value.items.forEach((item: any) => {
      totalInfo.subTotal = totalInfo.subTotal + item.amount;
      if (item.discount) {
        totalInfo.discounts = totalInfo.discounts;
      }

      if (!isNaN(item.gstPercentage) && item.gstPercentage > 0) {
        if (item.taxIncluded) {
          totalInfo.gst =
            (item.sellsPrice * item.gstPercentage) / (100 + item.gstPercentage);
        } else {
          totalInfo.gst = (item.gstPercentage * item.sellsPrice) / 100;
        }
      }
      if (!isNaN(item.cess) && item.cess > 0) {
        if (item.taxIncluded) {
          totalInfo.cess = (item.sellsPrice * item.cess) / (100 + item.cess);
        } else {
          totalInfo.cess = (item.cess * item.sellsPrice) / 100;
        }
      }
    });
    totalInfo.total = totalInfo.subTotal;
    return totalInfo;
  }
  getForm() {
    console.log(this.paymentForm.value);
    this.paymentForm.value;
  }

  onTaxDeductedStatusChange(event: any) {
    this.paymentForm.patchValue({
      taxDeducted: {
        mode: event.detail.value,
      },
    });
  }

  getBalanceDue(total: number) {
    const formvalue = this.paymentForm.value;
    return (
      total - (formvalue.paymentDone.amount ? formvalue.paymentDone.amount : 0)
    );
  }

  createPaymentDone(): FormGroup {
    return this.fb.group({
      mode: [PaymentStatusEnum.UNPAID, Validators.required],
      amount: ['0', Validators.required],
    });
  }
  createDiscount(): FormGroup {
    return this.fb.group({
      _id: [''],
      type: [''],
      code: [''],
      value: [''],
      minType: [''],
      minimum: [''],
      maxDiscount: [''],
    });
  }
  createAddressFormGroup() {
    return this.fb.group({
      line1: [''],
      line2: [''],
      city: [''],
      state: [''],
      pinCode: [''],
    });
  }
  createAddressesFormGroup() {
    return this.fb.group({
      shipping: this.createAddressFormGroup(),
      billingSameAsShipping: [true],
      billing: this.createAddressFormGroup(),
    });
  }
  createPartyFormGroup(): FormGroup {
    return this.fb.group({
      partyId: [''],
      name: ['', Validators.required],
      tradeName: [''],
      phoneNumber: [''],
      email: [''],
      gstin: [''],
      address: this.createAddressesFormGroup(),
    });
  }

  createInvoicePaymentFormGroup(invoiceId: string): FormGroup {
    return this.fb.group({
      invoiceId: [invoiceId, Validators.required],
      paymentAmount: ['0', Validators.required],
    });
  }

  get getFormControls() {
    const control = this.paymentForm.get('invoicePayments') as FormArray;
    return control;
  }

  addItem(invoiceId: string): void {
    const payments = this.paymentForm.get('invoicePayments') as FormArray;
    payments.push(this.createInvoicePaymentFormGroup(invoiceId));
  }

  removeItem(index: number): void {
    const items = this.paymentForm.get('invoicePayments') as FormArray;
    items.removeAt(index);
  }

  getTransactionDetails(index: number) {
    return this.unpaidPartyTransactions[index];
  }
}
