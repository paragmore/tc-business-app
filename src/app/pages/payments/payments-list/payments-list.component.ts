import { CommonModule, Location } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
import { ConfirmationModalComponent } from 'src/app/core/components/confirmation-modal/confirmation-modal.component';
import {
  CreditDebitLedgerListComponent,
  LedgerDataI,
  LedgerItemI,
} from 'src/app/core/components/credit-debit-ledger-list/credit-debit-ledger-list.component';
import {
  CreditDebitSummaryCardComponent,
  CreditDebitSummaryCardInputI,
} from 'src/app/core/components/credit-debit-summary-card/credit-debit-summary-card.component';
import { ItemNotFoundComponentInputI } from 'src/app/core/components/item-not-found/item-not-found.component';
import {
  FilterSortListsI,
  SearchFilterSortComponent,
  SearchSortFilterEventTypeEnum,
} from 'src/app/core/components/search-filter-sort/search-filter-sort.component';
import { CurrentStoreInfoService } from 'src/app/core/services/currentStore/current-store-info.service';
import {
  PaymentI,
  PaymentStatusEnum,
  PaymentTypeEnum,
  PaymentsFilterByQueryI,
  SortOrder,
  TransactionTypeEnum,
  TransactionsService,
} from 'src/app/core/services/transactions/transactions.service';
import { toastAlert } from 'src/app/core/utils/toastAlert';
import {
  deletePaymentInList,
  setPaymentsList,
} from 'src/app/store/actions/transactions.action';
import { ScreenModel } from 'src/app/store/models/screen.models';
import { AppState } from 'src/app/store/models/state.model';
import { StoreInfoModel } from 'src/app/store/models/userStoreInfo.models';
import { PaymentCreationFormComponent } from '../payment-creation-form/payment-creation-form.component';

@Component({
  selector: 'app-payments-list',
  templateUrl: './payments-list.component.html',
  styleUrls: ['./payments-list.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    SearchFilterSortComponent,
    CreditDebitSummaryCardComponent,
    CreditDebitLedgerListComponent,
  ],
})
export class PaymentsListComponent implements OnInit {
  currentPage = 1;
  totalPages = 100;
  pageSize = 10;
  isPaymentsLoading = false;
  currentStoreInfo: StoreInfoModel | undefined;
  public screenState$: Observable<ScreenModel> | undefined;
  enableMultiSelect = true;
  isMobile = false;
  PaymentTypeEnum = PaymentTypeEnum;
  selectedTab: PaymentTypeEnum = PaymentTypeEnum.IN;
  sortBy: string = 'name';
  sortOrder: SortOrder = 'asc';
  filters: PaymentsFilterByQueryI = {
    paymentType: this.selectedTab,
  };
  payments: Array<PaymentI> = [];
  selectedTransactions: Array<string> = [];
  currentTransactionId: string | undefined;
  partiesInjector!: Injector;
  creditDebitSummaryData: CreditDebitSummaryCardInputI | undefined;
  // MobileTransactionsListHeaderComponent = MobileTransactionsListHeaderComponent;
  goToPage = (page: number) => {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Fetch the data for the selected page or update the list accordingly
      this.loadPayments();
    }
  };
  changePageSize = (pageSize: number) => {
    console.log(pageSize);
    this.pageSize = pageSize;
    this.loadPayments();
    // Fetch the data for the new page size or update the list accordingly
  };

  toggleSort = (sortBy: string, order: SortOrder) => {
    this.sortBy = sortBy;
    this.sortOrder = order;
    this.loadPayments(undefined, true);
  };
  ledgerData: LedgerDataI = {
    ledgerItems: [],
    onSort: this.toggleSort,
    isLoading: this.isPaymentsLoading,
    currentPage: this.currentPage,
    totalPages: this.totalPages,
    goToPage: this.goToPage,
    changePageSize: this.changePageSize,
    col1Title: 'Transaction',
    col2Title: 'Amount',
    onSelectionToggle: (event: any, transactionId: string) => {
      this.onTransactionSelectionToggle(event, transactionId);
    },
    onLongPress: () => {
      this.onLongPress();
    },
    selectAllToggle: (event) => {
      this.selectAllToggle(event);
    },
    enableMultiSelect: this.enableMultiSelect,
    isSelected: (id) => {
      return this.isTransactionSelected(id);
    },
    getNotFoundInput: () => {
      return this.getNotFoundInput();
    },
  };
  constructor(
    private router: Router,
    private currentStoreInfoService: CurrentStoreInfoService,
    private store: Store<AppState>,
    private transactionsService: TransactionsService,
    private _location: Location,
    private modalController: ModalController,
    private toastContoller: ToastController,
    private injector: Injector
  ) {
    this.createInjector();
  }

  createInjector = () => {
    this.partiesInjector = Injector.create({
      providers: [
        { provide: 'selectedTab', useValue: this.selectedTab },
        {
          provide: 'creditDebitSummaryData',
          useValue: this.creditDebitSummaryData,
        },
        {
          provide: 'updateSelectedTab',
          useValue: this.updateSelectedTab,
        },
      ],
      parent: this.injector,
    });
  };

  filterSortOptions: FilterSortListsI = {
    filter: [
      {
        type: 'paymentStatus',
        text: PaymentStatusEnum.PAID,
        value: PaymentStatusEnum.PAID,
      },
      {
        type: 'paymentStatus',
        text: PaymentStatusEnum.PARTIALLY_PAID,
        value: PaymentStatusEnum.PARTIALLY_PAID,
      },
      {
        type: 'paymentStatus',
        text: PaymentStatusEnum.UNPAID,
        value: PaymentStatusEnum.UNPAID,
      },
    ],
    sort: [
      { type: 'name', text: 'Name ascending (A - Z)', value: 'asc' },
      { type: 'name', text: 'Name decending (Z - A)', value: 'desc' },
      { type: 'balance', text: 'Balance low to high', value: 'asc' },
      { type: 'balance', text: 'Balance high to low', value: 'desc' },
    ],
    searchPlaceholder: `Search by invoice id or party name`,
  };

  ngOnInit() {
    this.screenState$ = this.store.select((store) => store.screen);
    this.screenState$.subscribe((screen) => {
      this.isMobile = screen.isMobile;
      this.enableMultiSelect = !this.isMobile;
    });
    this.currentStoreInfoService.getCurrentStoreInfo().subscribe((response) => {
      this.currentStoreInfo = response;
      this.loadPayments();
      // this.loadStoreTransactionsTotalBalance();
    });
    this.store
      .select((store) => store.transactions)
      .subscribe((transactions) => {
        this.payments = transactions.paymentsList;
        this.updateLedgerData();
      });
  }

  loadStoreTransactionsTotalBalance() {}

  loadMoreData(event: any) {
    if (event) {
      this.currentPage = this.currentPage + 1;
      this.loadPayments(() => event.target.complete());
    }
  }
  updateSelectedTab = (event: any) => {
    console.log(this._location.path());
    this.selectedTab = event.detail.value;
    this.filters.paymentType = this.selectedTab;

    // this._location.replaceState(
    //   this._location.path() + `?type=${this.selectedTab}`
    // );
    this.navigateWithQuery({ type: this.selectedTab });
    this.loadPayments(undefined, true);
    this.loadStoreTransactionsTotalBalance();
  };

  navigateWithQuery(queryParams: any, replace?: boolean) {
    this.router.navigate([], {
      queryParams,
      queryParamsHandling: replace ? undefined : 'merge',
    });
  }

  isTransactionSelected = (transactionId: string) => {
    return !!this.selectedTransactions.find(
      (selectedTransactionId) => selectedTransactionId === transactionId
    );
  };

  onTransactionSelectionToggle = (event: any, transactionId: string) => {
    if (event.detail.checked) {
      this.selectedTransactions.push(transactionId);
    }
    if (event.detail.checked === false) {
      const deleteIndex = this.selectedTransactions.findIndex(
        (selectedTransactionId) => selectedTransactionId === transactionId
      );
      this.selectedTransactions.splice(deleteIndex, 1);
    }
    console.log(this.selectedTransactions);
  };
  navigateToCreateTransaction(type: PaymentTypeEnum) {
    this.router.navigate(['/transactions/create'], {
      queryParams: { type },
    });
  }

  onOpenDetailsPage = (ledger: LedgerItemI) => {
    console.log('onOpenDetailsPage', this.isMobile, this.enableMultiSelect);
    if (this.enableMultiSelect && this.isMobile) {
      return;
    }
    this.openTransactionDetailsPage(ledger.id);
  };

  ngDoCheck() {
    this.ledgerData = {
      ledgerItems: this.ledgerData.ledgerItems,
      onSort: this.toggleSort,
      isLoading: this.isPaymentsLoading,
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      goToPage: this.goToPage,
      changePageSize: this.changePageSize,
      col1Title: 'Name',
      col2Title: 'Amount',
      onSelectionToggle: (event: any, partyId: string) => {
        this.onTransactionSelectionToggle(event, partyId);
      },
      onLongPress: () => {
        this.onLongPress();
      },
      selectAllToggle: (event) => {
        this.selectAllToggle(event);
      },
      enableMultiSelect: this.enableMultiSelect,
      isSelected: (id) => {
        return this.isTransactionSelected(id);
      },
      getNotFoundInput: () => {
        return this.getNotFoundInput();
      },
    };
  }

  getNotFoundInput() {
    if (this.selectedTab === PaymentTypeEnum.IN) {
      const notfoundInput: ItemNotFoundComponentInputI = {
        title: 'Payments not found',
        subtitle: 'Please create new payment',
      };
      return notfoundInput;
    }
    if (this.selectedTab === PaymentTypeEnum.OUT) {
      const notfoundInput: ItemNotFoundComponentInputI = {
        title: 'Payments not found',
        subtitle: 'Please create new payment',
      };
      return notfoundInput;
    }
    const notfoundInput: ItemNotFoundComponentInputI = {
      title: '',
      subtitle: '',
    };
    return notfoundInput;
  }

  updateLedgerData() {
    this.ledgerData.ledgerItems = this.payments.map((transaction) => {
      let ledgerItem: LedgerItemI;
      const supplierData = transaction;
      ledgerItem = {
        id: supplierData._id,
        title: supplierData.partyId || '',
        subTitle: format(new Date(supplierData.date), 'dd MMM yyyy'),
        chipText: supplierData.paymentType,
        amount: {
          text: Math.abs(supplierData.amount)?.toString(),
        },
        amountSubtitle: {
          text: supplierData.paymentMode,
          // color: this.getPaymentStatusColor(supplierData.paymentMode),
        },
        imageUrl:
          supplierData.paymentType === PaymentTypeEnum.IN
            ? 'https://www.freeiconspng.com/thumbs/sales-icon/sales-icon-10.png'
            : 'https://icons.veryicon.com/png/o/business/store-marketing-management-icon/goods-purchase-order.png',
        onClick: this.onTransactionLedgerCardClicked,
        openDetailsPage: this.onOpenDetailsPage,
      };
      return ledgerItem;
    });
  }

  getPaymentStatusColor(paymentStatus: PaymentStatusEnum) {
    switch (paymentStatus) {
      case PaymentStatusEnum.PAID:
        return 'success';
      case PaymentStatusEnum.UNPAID:
        return 'danger';
      case PaymentStatusEnum.PARTIALLY_PAID:
        return 'warning';
    }
  }

  onTransactionLedgerCardClicked = (ledger: LedgerItemI) => {
    this.openTransactionDetails(ledger.id);
  };

  deleteTransactions = (onDeleteSuccessful?: () => {}) => {
    const transactionIds = this.selectedTransactions;
    const storeId = this.currentStoreInfo?._id;
    if (!storeId) {
      return;
    }
    return this.transactionsService
      .deleteStoreTransactions(storeId, transactionIds)
      .subscribe({
        next: (response: any) => {
          //@ts-ignore
          console.log(response?.body);
          if (onDeleteSuccessful) {
            onDeleteSuccessful();
            this.selectedTransactions.map((partyId) =>
              this.store.dispatch(deletePaymentInList({ payment: partyId }))
            );
            this.selectedTransactions = [];
          }
          toastAlert(this.toastContoller, 'Transactions deleted successfully');
        },
        error: () => {},
        complete: () => {},
      });
  };

  async openDeleteConfirmationModal() {
    const modal = await this.modalController.create({
      component: ConfirmationModalComponent,
      componentProps: {
        confirmationModalInput: {
          headerTitle: 'Delete transactions',
          body: {
            title: 'Are you sure?',
            icon: {
              name: 'close-circle-outline',
              class: 'danger',
            },
            subText:
              'Do you really want to delete these transactions? This process cannot be undone',
          },
          ctaButton: {
            text: 'Delete',
            class: 'danger',
            onClick: () => {
              console.log('confirm clicked');
              this.deleteTransactions(() => modal.dismiss());
            },
          },
        },
      },
      backdropDismiss: true,
      cssClass: 'login-modal',
    });

    modal.onDidDismiss().then((event) => {
      if (event && event.data) {
        console.log('Modal dismissed with data:', event.data);
      }
    });

    modal.onDidDismiss().then((modalData) => {});
    return await modal.present();
  }

  async openPaymentCreationModal() {
    const modal = await this.modalController.create({
      component: PaymentCreationFormComponent,
      componentProps: { transactionType: TransactionTypeEnum.SALE },
      backdropDismiss: true,
      cssClass: 'side-modal',
    });

    modal.onDidDismiss().then((modalData) => {});
    return await modal.present();
  }

  onLongPress = () => {
    console.log('long');
    this.enableMultiSelect = true;
  };

  selectAllToggle = (event: any) => {
    if (event.detail.checked) {
      const selected = this.payments.map((resp) => {
        return resp._id;
      });
      if (selected) {
        this.selectedTransactions = selected;
      }
    }
    if (event.detail.checked === false) {
      this.selectedTransactions = [];
    }
  };

  onMultipleSelectCancel() {
    this.selectedTransactions = [];
  }

  openTransactionDetails = (customerId: string) => {
    if (this.enableMultiSelect && this.isMobile) {
      return;
    }
    this._location.replaceState(
      `transactions/${customerId}?type=${this.selectedTab}`
    );
    console.log('openTransactionDetails');
    this.isMobile ? this.openTransactionDetailsPage(customerId) : null;
  };

  openTransactionDetailsPage = (customerId: string) => {
    this.router.navigate([`transaction/${customerId}`], {
      queryParams: { type: this.selectedTab },
    });
  };

  resetPagination() {
    this.currentPage = 1;
    this.totalPages = 1;
    this.pageSize = 10;
  }

  loadPayments(onLoadingFinished?: () => void, isReload?: boolean) {
    if (isReload) {
      this.resetPagination();
    }
    if (this.isPaymentsLoading) {
      return;
    }
    if (!this.currentStoreInfo?._id) {
      return;
    }
    this.isPaymentsLoading = true;
    console.log(1);
    this.transactionsService
      .getAllStorePayments(this.currentStoreInfo?._id, {
        page: this.currentPage.toString(),
        pageSize: this.pageSize.toString(),
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
        ...this.filters,
      })
      .subscribe(
        (response) => {
          console.log('FILTERS', this.filters);

          //@ts-ignore
          if (response.message === 'Success') {
            //@ts-ignore
            console.log(response.body.payments);
            //@ts-ignore
            const newPayments =
              this.isMobile && !isReload
                ? //@ts-ignore
                  [...this.payments, ...response.body.payments]
                : //@ts-ignore
                  [...response.body.payments];
            this.store.dispatch(setPaymentsList({ paymentsList: newPayments }));

            //@ts-ignore
            const pagination = response.body.pagination;
            this.currentPage = pagination.page;
            this.pageSize = pagination.pageSize;
            this.totalPages = pagination.totalPages;
            //@ts-ignore

            !this.isMobile &&
            !this.currentTransactionId &&
            !this.isMobile &&
            !this.currentTransactionId &&
            '_id' in this.payments[0]
              ? this.openTransactionDetails(this.payments[0]._id)
              : null;
          }
        },
        (error) => {},
        () => {
          this.isPaymentsLoading = false;
          onLoadingFinished && onLoadingFinished();
        }
      );
    console.log(3);
  }

  onSearchSortFilter = (event: any) => {
    console.log(event);
    if (event.type === SearchSortFilterEventTypeEnum.FILTER) {
      this.addFilter(event.selected.type, event.selected.value);
    }
    if (event.type === SearchSortFilterEventTypeEnum.SORT) {
      this.toggleSort(event.selected.type, event.selected.value);
    }
  };

  addFilter = (filterBy: string, filterValue: string) => {
    this.loadPayments(undefined, true);
  };
}
