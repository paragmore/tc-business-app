// transaction-creation-form.component.ts

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CurrentStoreInfoService } from 'src/app/core/services/currentStore/current-store-info.service';
import {
  CustomerStoreInfoI,
  GetAllCustomersResponseI,
  PartiesFilterByQueryI,
  PartiesService,
  PartyTypeEnum,
  SupplierI,
} from 'src/app/core/services/parties/parties.service';
import {
  DiscountI,
  ItemTypeEnum,
  ProductI,
  ProductsService,
} from 'src/app/core/services/products/products.service';
import { setPartiesList } from 'src/app/store/actions/parties.action';
import { ScreenModel } from 'src/app/store/models/screen.models';
import { AppState } from 'src/app/store/models/state.model';
import { StoreInfoModel } from 'src/app/store/models/userStoreInfo.models';
import { PartyCreationModalComponent } from '../../parties/party-creation-modal/party-creation-modal.component';
import { ItemCreationComponent } from '../../items/item-creation/item-creation.component';
import { DiscountsModalComponent } from '../../items/discounts-modal/discounts-modal.component';
@Component({
  selector: 'app-transaction-creation-form',
  templateUrl: './transaction-creation-form.component.html',
  styleUrls: ['./transaction-creation-form.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule],
})
export class TransactionCreationFormComponent {
  salesForm: FormGroup;
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
  filters: PartiesFilterByQueryI = {};
  parties: Array<GetAllCustomersResponseI | SupplierI> = [];
  currentStoreInfo: StoreInfoModel | undefined;
  selectedTab: PartyTypeEnum = PartyTypeEnum.CUSTOMER;
  selectedParty: GetAllCustomersResponseI | SupplierI | undefined;
  products: ProductI[] = [];
  selectedItems: ProductI[] = [];
  isUpdatingForm = false;
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private partiesService: PartiesService,
    private currentStoreInfoService: CurrentStoreInfoService,
    private productsService: ProductsService,
    private modalController: ModalController
  ) {
    this.salesForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.currentStoreInfoService.getCurrentStoreInfo().subscribe((response) => {
      this.currentStoreInfo = response;
      this.loadCustomers();
      this.loadProducts();
    });
    this.salesForm = this.fb.group({
      salesItems: this.fb.array([this.createSalesItem()]),
      party: this.createPartyFormGroup(),
      date: [new Date(), Validators.required],
      invoiceId: ['', Validators.required],
      stateOfSupply: ['', Validators.required],
      customerNotes: [''],
      termsAndConditions: [''],
      paymentDone: this.createPaymentDone(),
      // phoneNumber: ['', Validators.required],
      // customerGSTIN: ['', Validators.required],
      // invoiceNumber: ['', Validators.required],
      // invoiceDate: ['', Validators.required],
      // storeGSTIN: ['', Validators.required],
      // state: ['', Validators.required],
      // partyDetails: this.createPartyFormGroup(),
      // invoiceDetails: this.createInvoiceFormGroup(),
    });
    this.screenState$ = this.store.select((store) => store.screen);

    const salesItemsFormArray = this.salesForm.get('salesItems') as FormArray;
    let previousSalesItems = [...salesItemsFormArray.value];
    this.isUpdatingForm = false;

    salesItemsFormArray.valueChanges.subscribe((salesItems) => {
      if (this.isUpdatingForm) {
        // Ignore value changes triggered programmatically
        return;
      }

      for (let i = 0; i < salesItems.length; i++) {
        const previousSalesItem = previousSalesItems[i];
        const currentSalesItem = salesItems[i];

        if (
          JSON.stringify(previousSalesItem) !== JSON.stringify(currentSalesItem)
        ) {
          console.log('Changed salesItem:', currentSalesItem);
          this.onChangeItemValues(i);
          // Perform your calculations or updates for the changed salesItem here
        }
      }

      previousSalesItems = [...salesItems];
    });
  }

  async openEditProductModal(productDetails: ProductI) {
    const modal = await this.modalController.create({
      component: ItemCreationComponent,
      componentProps: {
        editProduct: {
          ...productDetails,
        },
        type: productDetails.isService
          ? ItemTypeEnum.SERVICE
          : ItemTypeEnum.PRODUCT,
      },
      backdropDismiss: true,
      cssClass: 'side-modal',
    });

    modal.onDidDismiss().then((modalData) => {});
    return await modal.present();
  }

  async openDiscountsModal(index: number) {
    console.log('idhar');
    const modal = await this.modalController.create({
      component: DiscountsModalComponent,
      backdropDismiss: true,
      cssClass: 'login-modal',
      // breakpoints: this.isMobile ? [0, 0.8, 1] : undefined,
      // initialBreakpoint: this.isMobile ? 0.8 : 1,
    });
    console.log(modal);

    modal.onDidDismiss().then((modalData) => {
      if (modalData?.data?.discount) {
        const salesItemsForm = this.salesForm.get('salesItems') as FormArray;
        if (salesItemsForm) {
          salesItemsForm.at(index).patchValue({
            discount: modalData.data.discount,
          });
        }
      }
    });
    return await modal.present();
  }

  createSale() {
    // Handle sale creation logic here
    console.log(this.salesForm.value);
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

  selectTransactionParty(party: GetAllCustomersResponseI | SupplierI) {
    this.selectedParty = party;
    let partyFormPayload: any;
    if ('customer' in party) {
      partyFormPayload = {
        _id: party.customerStoreInfo.customerId,
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
        _id: party._id,
        name: party.name,
        tradeName: party.tradeName,
        phoneNumber: party.phoneNumber,
        email: party.email,
        gstin: party.gstin,
        address: party.addresses ? party.addresses[0] : undefined,
      };
    }
    this.salesForm.patchValue({
      party: partyFormPayload,
    });
  }

  resetPagination() {
    this.partyCurrentPage = 1;
    this.partyTotalPages = 1;
    this.partyPageSize = 10;
  }

  loadProducts(onLoadingFinished?: () => void, isReload?: boolean) {
    if (isReload) {
      this.resetPagination();
    }
    if (this.isProductsLoading) {
      return;
    }
    if (!this.currentStoreInfo?._id) {
      return;
    }
    this.isProductsLoading = true;
    this.productsService
      .getAllStoreProducts(this.currentStoreInfo?._id, {
        page: this.itemsCurrentPage.toString(),
        pageSize: this.itemsPageSize.toString(),
      })
      .subscribe(
        (response) => {
          //@ts-ignore
          if (response.message === 'Success') {
            //@ts-ignore
            //@ts-ignore
            this.products = !isReload
              ? //@ts-ignore
                [...this.products, ...response.body.products]
              : //@ts-ignore
                [...response.body.products];
            //@ts-ignore
            const pagination = response.body.pagination;
            this.itemsCurrentPage = pagination.page;
            this.itemsPageSize = pagination.pageSize;
            this.itemsTotalPages = pagination.totalPages;
          }
        },
        () => {},
        () => {
          this.isProductsLoading = false;
          onLoadingFinished && onLoadingFinished();
        }
      );
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
      .getAllStoreParties(this.currentStoreInfo?._id, this.selectedTab, {
        page: this.partyCurrentPage.toString(),
        pageSize: this.partyPageSize.toString(),
        ...this.filters,
      })
      .subscribe(
        (response) => {
          //@ts-ignore
          if (response.message === 'Success') {
            //@ts-ignore
            //@ts-ignore
            this.parties = !isReload
              ? //@ts-ignore
                [...this.parties, ...response.body.parties]
              : //@ts-ignore
                [...response.body.parties];

            //@ts-ignore
            const pagination = response.body.pagination;
            this.partyCurrentPage = pagination.page;
            this.partyPageSize = pagination.pageSize;
            this.partyTotalPages = pagination.totalPages;
          }
        },
        (error) => {},
        () => {
          this.isCustomersLoading = false;
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
      componentProps: { partyType: this.selectedTab },
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
    this.salesForm.value.salesItems.map((item: any) => {
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

  selectBestDiscount(discounts: DiscountI[], quantity: number, amount: number) {
    let bestDiscount = null;
    let bestDiscountAmount = 0;
    const applicableDiscounts = this.getApplicableDiscounts(
      discounts,
      quantity,
      amount
    );
    for (const discount of applicableDiscounts) {
      if (
        (discount.minType === 'orderQuantity' &&
          discount?.minimum &&
          quantity >= discount?.minimum) ||
        (discount.minType === 'orderValue' &&
          discount?.minimum &&
          amount >= discount?.minimum)
      ) {
        let discountAmount = 0;
        if (discount.type === 'percentage') {
          discountAmount = (amount * discount.value) / 100;
          if (
            discount.maxDiscount !== null &&
            discount.maxDiscount &&
            discountAmount > discount.maxDiscount
          ) {
            discountAmount = discount.maxDiscount;
          }
        } else if (discount.type === 'amount') {
          discountAmount = discount.value;
        }

        if (discountAmount > bestDiscountAmount) {
          bestDiscount = discount;
          bestDiscountAmount = discountAmount;
        }
      }
    }

    return { applicableDiscounts, bestDiscount };
  }

  onDiscountChange(index: number, discount: DiscountI) {
    const salesItemsForm = this.salesForm.get('salesItems') as FormArray;
    if (salesItemsForm) {
      salesItemsForm.at(index).patchValue({
        discount: discount,
      });
    }
  }

  onChangeItemValues(index: number) {
    const salesItemsForm = this.salesForm.get('salesItems') as FormArray;
    if (salesItemsForm) {
      const formGroup = salesItemsForm.at(index) as FormGroup;
      const formValue = formGroup.value;
      console.log(formValue);
      const amount = this.calculateAmount(
        formValue.sellsPrice,
        formValue.quantity,
        formValue.taxIncluded,
        formValue.gstPercentage,
        formValue.cess,
        formValue.discount
      );
      console.log('AMOUNT', amount);

      // Set the flag to true before updating the form value
      this.isUpdatingForm = true;

      // Use setValue instead of patchValue to avoid triggering valueChanges again
      formGroup.setValue({
        ...formValue,
        amount: amount,
      });

      // Set the flag back to false after updating the form value
      this.isUpdatingForm = false;
    }
  }

  removeDiscount(index: number) {
    const salesItemsForm = this.salesForm.get('salesItems') as FormArray;
    if (salesItemsForm) {
      const discount: DiscountI = {
        code: '',
        minType: 'orderQuantity',
        value: 0,
        type: 'amount',
        maxDiscount: 0,
        minimum: 0,
      };
      salesItemsForm.at(index).patchValue({
        discount: discount,
      });
    }
  }
  onSelectItem(item: ProductI, index: number) {
    const salesItemsForm = this.salesForm.get('salesItems') as FormArray;

    if (salesItemsForm) {
      const quantity = salesItemsForm.at(index).value.quantity;

      const bestDiscount = this.selectBestDiscount(
        item.discounts,
        quantity,
        item.sellsPrice
      ).bestDiscount;
      const amount = this.calculateAmount(
        item.sellsPrice,
        quantity,
        item.taxIncluded,
        item.gstPercentage,
        item.cess,
        bestDiscount
      );
      console.log(bestDiscount);
      salesItemsForm.at(index).patchValue({
        sellsPrice: item.sellsPrice,
        itemId: item._id,
        itemName: item.name,
        gst: item.gstPercentage ? item.gstPercentage : '0',
        cess: item.cess ? item.cess : '0',
        rate: item.sellsPrice,
        taxIncluded: item.taxIncluded,
        amount: amount,
        discount: bestDiscount,
      });

      this.selectedItems[index] = item;
      console.log('FORM', salesItemsForm.at(index));
      this.getForm();
    }
  }

  getForm() {
    console.log(this.salesForm.value);
    this.salesForm.value;
  }

  getRemainingProducts() {
    return this.products.filter(
      (product) =>
        !this.selectedItems?.find(
          (selectedProd) => selectedProd?._id === product?._id
        )
    );
  }

  getItemDetails(index: number) {
    return this.selectedItems[index];
  }

  // createPartyFormGroup(): FormGroup {
  //   return this.fb.group({
  //     customerName: ['', Validators.required],
  //     phoneNumber: ['', Validators.required],
  //     customerGSTIN: ['', Validators.required],
  //   });
  // }

  // createInvoiceFormGroup(): FormGroup {
  //   return this.fb.group({
  //     invoiceNumber: ['', Validators.required],
  //     invoiceDate: ['', Validators.required],
  //     storeGSTIN: ['', Validators.required],
  //     state: ['', Validators.required],
  //   });
  // }

  createSalesItem(): FormGroup {
    return this.fb.group({
      itemName: ['', Validators.required],
      itemId: [''],
      quantity: ['1.00', Validators.required],
      sellsPrice: ['0', Validators.required],
      discount: this.createDiscount(),
      gstPercentage: ['0', Validators.required],
      taxIncluded: [true, Validators.required],
      cess: ['0', Validators.required],
      amount: ['0', Validators.required],
    });
  }

  createPaymentDone(): FormGroup {
    return this.fb.group({
      mode: ['CASH', Validators.required],
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
    const control = this.salesForm.get('salesItems') as FormArray;
    return control;
  }

  addItem(): void {
    const salesItems = this.salesForm.get('salesItems') as FormArray;
    salesItems.push(this.createSalesItem());
  }

  removeItem(index: number): void {
    const salesItems = this.salesForm.get('salesItems') as FormArray;
    salesItems.removeAt(index);
  }
}
