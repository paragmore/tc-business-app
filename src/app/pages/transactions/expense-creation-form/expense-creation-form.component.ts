import { Component, OnInit } from '@angular/core';
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
  PartiesFilterByQueryI,
  PartiesService,
  PartyTypeEnum,
  SupplierI,
} from 'src/app/core/services/parties/parties.service';
import {
  CostOfGoodsSoldAccountTypeEnum,
  DiscountI,
  ExpenseAccountTypeEnum,
  ItemTypeEnum,
  ProductI,
  ProductsService,
  TaxPreferenceEnum,
} from 'src/app/core/services/products/products.service';
import {
  CreateTransactionRequestI,
  PaymentModeEnum,
  PaymentStatusEnum,
  TransactionTypeEnum,
  TransactionsService,
} from 'src/app/core/services/transactions/transactions.service';
import { ScreenModel } from 'src/app/store/models/screen.models';
import { AppState } from 'src/app/store/models/state.model';
import { StoreInfoModel } from 'src/app/store/models/userStoreInfo.models';
import { ItemCreationComponent } from '../../items/item-creation/item-creation.component';
import { toastAlert } from 'src/app/core/utils/toastAlert';
import { PartyCreationModalComponent } from '../../parties/party-creation-modal/party-creation-modal.component';
import { DiscountsModalComponent } from '../../items/discounts-modal/discounts-modal.component';
import { CommonModule } from '@angular/common';
import { StatePopoverComponent } from 'src/app/core/components/state-popover/state-popover.component';
import {
  GSTTypeI,
  GstTypeListComponent,
} from 'src/app/core/components/gst-type-list/gst-type-list.component';
import {
  TaxPopoverComponent,
  TaxTypeEnum,
} from '../../items/tax-popover/tax-popover.component';

@Component({
  selector: 'app-expense-creation-form',
  templateUrl: './expense-creation-form.component.html',
  styleUrls: ['./expense-creation-form.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StatePopoverComponent,
    GstTypeListComponent,
  ],
})
export class ExpenseCreationFormComponent implements OnInit {
  salesForm: FormGroup;
  public screenState$: Observable<ScreenModel> | undefined;
  customerCurrentPage = 1;
  customerTotalPages = 100;
  customerPageSize = 10;
  supplierCurrentPage = 1;
  supplierTotalPages = 100;
  supplierPageSize = 10;
  hasMoreCustomers = true;
  isCustomersLoading = false;
  isSuppliersLoading = false;
  itemsCurrentPage = 1;
  itemsTotalPages = 100;
  itemsPageSize = 10;
  filters: PartiesFilterByQueryI = {};
  customers: Array<GetAllCustomersResponseI> = [];
  suppliers: Array<SupplierI> = [];

  currentStoreInfo: StoreInfoModel | undefined;
  selectedPartyTab: PartyTypeEnum = PartyTypeEnum.CUSTOMER;
  selectedParty: GetAllCustomersResponseI | SupplierI | undefined;
  products: ProductI[] = [];
  isUpdatingForm = false;
  PaymentStatusEnum = PaymentStatusEnum;
  PaymentModeEnum = PaymentModeEnum;
  isLoading = false;
  transactionType!: TransactionTypeEnum;
  selectedGSTType: GSTTypeI | undefined;

  accountsTypeList = {
    expense: Object.values(ExpenseAccountTypeEnum),
    cogs: Object.values(CostOfGoodsSoldAccountTypeEnum),
  };

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private partiesService: PartiesService,
    private currentStoreInfoService: CurrentStoreInfoService,
    private productsService: ProductsService,
    private modalController: ModalController,
    private transactionsService: TransactionsService,
    private toastController: ToastController,
    private route: ActivatedRoute
  ) {
    this.salesForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.transactionType = params['type'];
      if (this.transactionType === TransactionTypeEnum.SALE) {
        this.selectedPartyTab = PartyTypeEnum.CUSTOMER;
      }
      if (this.transactionType === TransactionTypeEnum.PURCHASE) {
        this.selectedPartyTab = PartyTypeEnum.SUPPLIER;
      }
      // Use the values in your component logic
    });
    this.salesForm = this.fb.group({
      items: this.fb.array([this.createSalesItem()]),
      supplier: this.createPartyFormGroup(),
      customer: this.createPartyFormGroup(),
      date: [new Date(), Validators.required],
      invoiceId: ['', Validators.required],
      stateOfSupply: ['', Validators.required],
      customerNotes: [''],
      termsAndConditions: [''],
      paymentDone: this.createPaymentDone(),
      gstType: ['', Validators.required],
      destinationOfSupply: ['', Validators.required],
      // phoneNumber: ['', Validators.required],
      // customerGSTIN: ['', Validators.required],
      // invoiceNumber: ['', Validators.required],
      // invoiceDate: ['', Validators.required],
      // storeGSTIN: ['', Validators.required],
      // state: ['', Validators.required],
      // partyDetails: this.createPartyFormGroup(),
      // invoiceDetails: this.createInvoiceFormGroup(),
    });
    this.currentStoreInfoService.getCurrentStoreInfo().subscribe((response) => {
      this.currentStoreInfo = response;
      if (this.currentStoreInfo?.lastInvoiceInfo) {
        console.log(this.currentStoreInfo?.lastInvoiceInfo);
        this.salesForm.patchValue({
          invoiceId:
            '' +
            this.currentStoreInfo?.lastInvoiceInfo.sequence +
            ' - ' +
            (this.currentStoreInfo?.lastInvoiceInfo.invoiceId + 1),
        });
      }
      this.loadCustomers();
      this.loadSuppliers();
    });

    this.screenState$ = this.store.select((store) => store.screen);
  }

  async selectGSTType(gstType: GSTTypeI) {
    this.selectedGSTType = gstType;
    this.salesForm.patchValue({ gstType: gstType.title });
  }

  onPartyShippingStateSelect(state: string) {
    console.log('STATE', state);
    this.salesForm.patchValue({ party: { address: { shipping: { state } } } });
  }

  onPartyBillingStateSelect(state: string) {
    console.log('STATE', state);
    this.salesForm.patchValue({ party: { address: { billing: { state } } } });
  }

  onStateSelect(state: string) {
    console.log('STATE', state);
    this.salesForm.patchValue({ stateOfSupply: state });
  }

  createTransaction() {
    // Handle sale creation logic here
    console.log(this.salesForm.value);
    if (!this.currentStoreInfo?._id) {
      return;
    }
    const salesFormValue: {
      items: [];
      party: {
        _id: string;
        name: string;
        tradeName: string;
        phoneNumber: string;
        email: string;
        gstin: string;
        address: {
          shipping: {
            line1: string;
            line2: string;
            city: string;
            state: string;
            pinCode: string;
          };
          billingSameAsShipping: boolean;
          billing: {
            line1: string;
            line2: string;
            city: string;
            state: string;
            pinCode: string;
          };
        };
      };
      date: Date;
      invoiceId: string;
      stateOfSupply: string;
      customerNotes: string;
      termsAndConditions: string;
      paymentDone: {
        mode: string;
        amount: number;
      };
    } = this.salesForm.value;
    const transactionsPayload: CreateTransactionRequestI = {
      storeId: this.currentStoreInfo?._id,
      transactionType: this.transactionType,
      ...salesFormValue,
      dueDate: new Date(),
      additionalFields: [],
      party: {
        ...salesFormValue.party,
        address: salesFormValue.party.address.shipping.pinCode
          ? salesFormValue.party.address
          : undefined,
      },
    };
    console.log(transactionsPayload);
    const replaced = this.replaceEmptyObjectsWithUndefined(transactionsPayload);
    console.log(replaced);
    this.isLoading = true;
    this.transactionsService
      .createStoreTransaction(transactionsPayload)
      .subscribe(
        (response) => {
          console.log(response);
          //@ts-ignore
          if (response.message === 'Success') {
            toastAlert(
              this.toastController,
              `${this.selectedPartyTab} created successfully`,
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
      _id: '',
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
    this.salesForm.patchValue({
      party: partyFormPayload,
    });
  }

  selectExpenseSupplier(party: SupplierI) {
    this.selectedParty = party;
    let partyFormPayload: any;

    partyFormPayload = {
      _id: party._id,
      name: party.name,
      tradeName: party.tradeName,
      phoneNumber: party.phoneNumber,
      email: party.email,
      gstin: party.gstin,
      address: party.addresses ? party.addresses[0] : undefined,
    };

    this.salesForm.patchValue({
      supplier: partyFormPayload,
    });
  }

  selectExpenseCustomer(party: GetAllCustomersResponseI) {
    this.selectedParty = party;
    let partyFormPayload: any;

    partyFormPayload = {
      _id: party.customerStoreInfo._id,
      name: party.customerStoreInfo.name,
      tradeName: party.customerStoreInfo.tradeName,
      phoneNumber: party.customer.phoneNumber,
      email: party.customerStoreInfo.email,
      gstin: party.customerStoreInfo.gstin,
      address: party.customerStoreInfo.addresses
        ? party.customerStoreInfo.addresses[0]
        : undefined,
    };

    this.salesForm.patchValue({
      supplier: partyFormPayload,
    });
  }
  resetPagination() {
    this.customerCurrentPage = 1;
    this.customerTotalPages = 1;
    this.customerPageSize = 10;
  }

  loadCustomers(onLoadingFinished?: () => void, isReload?: boolean) {
    if (isReload) {
      this.resetPagination();
    }
    if (this.isCustomersLoading) {
      return;
    }
    if (!this.currentStoreInfo?._id) {
      return;
    }
    this.isCustomersLoading = true;
    this.partiesService
      .getAllStoreParties(this.currentStoreInfo?._id, PartyTypeEnum.CUSTOMER, {
        page: this.customerCurrentPage.toString(),
        pageSize: this.customerPageSize.toString(),
        ...this.filters,
      })
      .subscribe(
        (response) => {
          //@ts-ignore
          if (response.message === 'Success') {
            //@ts-ignore
            //@ts-ignore
            this.customers = !isReload
              ? //@ts-ignore
                [...this.customers, ...response.body.parties]
              : //@ts-ignore
                [...response.body.parties];

            //@ts-ignore
            const pagination = response.body.pagination;
            this.customerCurrentPage = pagination.page;
            this.customerPageSize = pagination.pageSize;
            this.customerTotalPages = pagination.totalPages;
          }
        },
        (error) => {},
        () => {
          this.isCustomersLoading = false;
          onLoadingFinished && onLoadingFinished();
        }
      );
  }

  loadSuppliers(onLoadingFinished?: () => void, isReload?: boolean) {
    if (isReload) {
      this.resetPagination();
    }
    if (this.isSuppliersLoading) {
      return;
    }
    if (!this.currentStoreInfo?._id) {
      return;
    }
    this.isSuppliersLoading = true;
    this.partiesService
      .getAllStoreParties(this.currentStoreInfo?._id, PartyTypeEnum.SUPPLIER, {
        page: this.supplierCurrentPage.toString(),
        pageSize: this.supplierPageSize.toString(),
        ...this.filters,
      })
      .subscribe(
        (response) => {
          //@ts-ignore
          if (response.message === 'Success') {
            //@ts-ignore
            //@ts-ignore
            this.suppliers = !isReload
              ? //@ts-ignore
                [...this.suppliers, ...response.body.parties]
              : //@ts-ignore
                [...response.body.parties];

            //@ts-ignore
            const pagination = response.body.pagination;
            this.customerCurrentPage = pagination.page;
            this.customerPageSize = pagination.pageSize;
            this.customerTotalPages = pagination.totalPages;
          }
        },
        (error) => {},
        () => {
          this.isSuppliersLoading = false;
          onLoadingFinished && onLoadingFinished();
        }
      );
  }

  getPartyDetails(party: GetAllCustomersResponseI | SupplierI) {
    if ('customer' in party) {
      return party.customerStoreInfo;
    }
    return party;
  }

  getCustomerDetails(party: GetAllCustomersResponseI | SupplierI) {
    if ('customer' in party) {
      return party.customer;
    }
    return party;
  }

  async openAddProductModal() {
    const modal = await this.modalController.create({
      component: ItemCreationComponent,
      componentProps: {
        type: ItemTypeEnum.PRODUCT,
      },
      backdropDismiss: true,
      cssClass: 'side-modal',
    });

    modal.onDidDismiss().then((modalData) => {});
    return await modal.present();
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

  calculateAmount(
    sellsPrice: number,
    quantity: number,
    taxIncluded: boolean | undefined,
    gstPercentage: number | undefined,
    cess: number | undefined,
    discount: DiscountI | undefined | null
  ) {
    let amount = sellsPrice * quantity;
    let tax = 0;
    if (gstPercentage) {
      tax = (amount * gstPercentage) / 100;
    }
    if (cess) {
      tax = tax + (amount * cess) / 100;
    }
    if (!taxIncluded) {
      amount = amount + tax;
    }
    if (discount) {
      const calculatedDiscount = this.getDiscountAmount(
        discount,
        sellsPrice * quantity
      );
      amount = amount - calculatedDiscount;
    }
    return amount;
  }

  getDiscountAmount(discount: DiscountI, amount: number) {
    let calculatedDiscount = 0;
    if (discount.type === 'percentage') {
      const newDiscount = (amount * discount.value) / 100;
      if (discount.maxDiscount && newDiscount > discount.maxDiscount) {
        calculatedDiscount = discount.maxDiscount;
      } else {
        calculatedDiscount = newDiscount;
      }
    }
    if (discount.type === 'amount') {
      calculatedDiscount = discount.value;
    }
    return calculatedDiscount;
  }

  getApplicableDiscounts(
    discounts: DiscountI[],
    quantity: number,
    amount: number
  ) {
    const applicableDiscounts = [];

    for (const discount of discounts) {
      if (
        (discount.minType === 'orderQuantity' &&
          discount?.minimum &&
          quantity >= discount?.minimum) ||
        (discount.minType === 'orderValue' &&
          discount?.minimum &&
          amount >= discount?.minimum)
      ) {
        applicableDiscounts.push(discount);
      }
    }

    return applicableDiscounts;
  }

  getTotalInformation() {
    const totalInfo = {
      subTotal: 0,
      gst: 0,
      cess: 0,
      discounts: 0,
      total: 0,
    };
    this.salesForm.value.items.map((item: any) => {
      totalInfo.subTotal = totalInfo.subTotal + item.amount;
      if (item.discount) {
        totalInfo.discounts =
          totalInfo.discounts +
          this.getDiscountAmount(
            item.discount,
            item.quantity * item.sellsPrice
          );
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
    console.log(this.salesForm.value);
    this.salesForm.value;
  }

  createSalesItem(): FormGroup {
    return this.fb.group({
      expenseAccount: ['', Validators.required],
      itemType: ['', Validators.required],
      hsnCode: [''],
      notes: [''],
      gstPercentage: [''],
      gstTaxPreference: [''],
      cess: [''],
      amount: ['0', Validators.required],
    });
  }

  onPurchaseAccountChange(account: any, index: number) {
    const itemsForm = this.salesForm.get('items') as FormArray;

    if (itemsForm) {
      itemsForm.at(index).patchValue({ expenseAccount: account });
    }
  }

  async openGSTTaxPopover(event: any, index: number) {
    this.showTaxPopover(event, TaxTypeEnum.GST, index);
  }

  async openCessTaxPopover(event: any, index: number) {
    this.showTaxPopover(event, TaxTypeEnum.CESS, index);
  }

  async showTaxPopover(event: any, type: TaxTypeEnum, index: number) {
    const taxPopoverOptions = {
      component: TaxPopoverComponent,
      componentProps: {
        taxPopoverInput: { type },
      },
      translucent: true,
      event: event,
      // breakpoints: this.isMobile ? [0, 0.8, 1] : undefined,
      // initialBreakpoint: this.isMobile ? 0.8 : 1,
      cssClass: 'login-modal', // Add a CSS class for custom styling if needed
    };

    let taxPopover = await this.modalController.create(taxPopoverOptions);
    await taxPopover.present();

    const { data } = await taxPopover.onDidDismiss();
    const itemsForm = this.salesForm.get('items') as FormArray;

    if (!itemsForm) {
      return;
    }
    if (data && data.selectedValue) {
      if (type === TaxTypeEnum.GST) {
        itemsForm.at(index).patchValue({
          gstPercentage: data.selectedValue,
          taxPreference: TaxPreferenceEnum.TAXABLE,
        });
      }
      if (type === TaxTypeEnum.CESS) {
        itemsForm.at(index).patchValue({ cess: data.selectedValue });
      }
    }
    if (data && data.selectedTaxPreference) {
      itemsForm.at(index).patchValue({
        taxPreference: data.selectedTaxPreference,
        gstPercentage: data.selectedTaxPreference,
      });
    }
  }

  onPaymentStatusChange(event: any) {
    this.salesForm.patchValue({
      paymentDone: {
        mode: event.detail.value,
      },
    });
  }

  getBalanceDue(total: number) {
    const formvalue = this.salesForm.value;
    return (
      total - (formvalue.paymentDone.amount ? formvalue.paymentDone.amount : 0)
    );
  }

  createPaymentDone(): FormGroup {
    return this.fb.group({
      mode: ['UNPAID', Validators.required],
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
      _id: [''],
      name: ['', Validators.required],
      tradeName: [''],
      phoneNumber: [''],
      email: [''],
      gstin: [''],
      address: this.createAddressesFormGroup(),
    });
  }

  get getFormControls() {
    const control = this.salesForm.get('items') as FormArray;
    return control;
  }

  addItem(): void {
    const items = this.salesForm.get('items') as FormArray;
    items.push(this.createSalesItem());
  }

  removeItem(index: number): void {
    const items = this.salesForm.get('items') as FormArray;
    items.removeAt(index);
  }
}
