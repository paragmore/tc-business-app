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
import { IonicModule } from '@ionic/angular';
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
  ProductI,
  ProductsService,
} from 'src/app/core/services/products/products.service';
import { setPartiesList } from 'src/app/store/actions/parties.action';
import { ScreenModel } from 'src/app/store/models/screen.models';
import { AppState } from 'src/app/store/models/state.model';
import { StoreInfoModel } from 'src/app/store/models/userStoreInfo.models';
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
  selectedParty: CustomerStoreInfoI | SupplierI | undefined;
  products: ProductI[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private partiesService: PartiesService,
    private currentStoreInfoService: CurrentStoreInfoService,
    private productsService: ProductsService
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
      customerName: ['', Validators.required],
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
  }

  createSale() {
    // Handle sale creation logic here
  }

  selectTransactionParty(party: CustomerStoreInfoI | SupplierI) {
    this.selectedParty = party;
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

  onSelectItem(item: ProductI, index: number) {
    const salesItemsForm = this.salesForm.get('salesItems') as FormArray;
    if (salesItemsForm) {
      salesItemsForm.at(index).patchValue({ sellsPrice: item.sellsPrice });
      console.log('FORM', salesItemsForm.at(index));
    }
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
      item: ['', Validators.required],
      quantity: ['1.00', Validators.required],
      sellsPrice: ['0', Validators.required],
      rate: ['0', Validators.required],
      discount: ['0', Validators.required],
      tax: ['0', Validators.required],
      amount: ['0', Validators.required],
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
