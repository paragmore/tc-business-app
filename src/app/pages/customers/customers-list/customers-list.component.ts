import {
  Component,
  DoCheck,
  Injector,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import {
  CreditDebitLedgerListComponent,
  LedgerDataI,
  LedgerItemI,
} from 'src/app/core/components/credit-debit-ledger-list/credit-debit-ledger-list.component';
import {
  CreditDebitSummaryCardComponent,
  CreditDebitSummaryCardInputI,
} from 'src/app/core/components/credit-debit-summary-card/credit-debit-summary-card.component';
import {
  FilterSortListsI,
  SearchFilterSortComponent,
  SearchSortFilterEventTypeEnum,
} from 'src/app/core/components/search-filter-sort/search-filter-sort.component';
import { PartyCreationModalComponent } from '../../parties/party-creation-modal/party-creation-modal.component';
import {
  CustomerI,
  GetAllCustomersResponseI,
  PartiesFilterByQueryI,
  PartiesService,
  PartyTypeEnum,
  StorePartiesTotalBalanceI,
  SupplierI,
} from 'src/app/core/services/parties/parties.service';
import { StoreInfoModel } from 'src/app/store/models/userStoreInfo.models';
import { SortOrder } from 'src/app/core/services/products/products.service';
import { Observable } from 'rxjs';
import { ScreenModel } from 'src/app/store/models/screen.models';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentStoreInfoService } from 'src/app/core/services/currentStore/current-store-info.service';
import { AppState } from 'src/app/store/models/state.model';
import { Store } from '@ngrx/store';
import { CommonModule, Location } from '@angular/common';
import { MobilePartiesListHeaderComponent } from '../../parties/mobile-parties-list-header/mobile-parties-list-header.component';
import {
  deletePartyInList,
  setPartiesList,
} from 'src/app/store/actions/parties.action';
import { ConfirmationModalComponent } from 'src/app/core/components/confirmation-modal/confirmation-modal.component';
import { toastAlert } from 'src/app/core/utils/toastAlert';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CreditDebitSummaryCardComponent,
    SearchFilterSortComponent,
    CreditDebitLedgerListComponent,
    CommonModule,
    MobilePartiesListHeaderComponent,
  ],
})
export class CustomersListComponent implements OnInit, DoCheck {
  constructor(
    private modalController: ModalController,
    private partiesService: PartiesService,
    private currentStoreInfoService: CurrentStoreInfoService,
    private store: Store<AppState>,
    private router: Router,
    private _location: Location,
    private injector: Injector,
    private toastContoller: ToastController
  ) {
    this.createInjector();
  }
  MobilePartiesListHeaderComponent = MobilePartiesListHeaderComponent;
  selectedTab: PartyTypeEnum = PartyTypeEnum.CUSTOMER;
  PartyTypeEnum = PartyTypeEnum;
  party: PartyTypeEnum = PartyTypeEnum.CUSTOMER;
  currentPartyId: string | undefined;
  private activatedRoute = inject(ActivatedRoute);
  parties: Array<GetAllCustomersResponseI | SupplierI> = [];
  currentPage = 1;
  totalPages = 100;
  pageSize = 10;
  hasMoreCustomers = true;
  currentStoreInfo: StoreInfoModel | undefined;
  sortBy: string = 'name';
  sortOrder: SortOrder = 'asc';
  isCustomersLoading = false;
  public screenState$: Observable<ScreenModel> | undefined;
  isMobile = false;
  totalBalance: StorePartiesTotalBalanceI | undefined;
  creditDebitSummaryData: CreditDebitSummaryCardInputI | undefined;
  selectedParties: Array<string> = [];
  partiesInjector!: Injector;
  filters: PartiesFilterByQueryI = {};
  enableMultiSelect = true;

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
      { type: 'balance', text: "You'll give", value: 'gt,0' },
      { type: 'balance', text: "You'll get", value: 'lt,0' },
      { type: 'balance', text: 'Zero Balance', value: 'eq,0' },
    ],
    sort: [
      { type: 'name', text: 'Name ascending (A - Z)', value: 'asc' },
      { type: 'name', text: 'Name decending (Z - A)', value: 'desc' },
      { type: 'balance', text: 'Balance low to high', value: 'asc' },
      { type: 'balance', text: 'Balance high to low', value: 'desc' },
    ],
    searchPlaceholder: `Search by ${this.selectedTab} name`,
  };
  toggleSort = (sortBy: string, order: SortOrder) => {
    this.sortBy = sortBy;
    this.sortOrder = order;
    this.loadCustomers(undefined, true);
  };

  addFilter = (filterBy: string, filterValue: string) => {
    if (filterBy === 'balance') {
      this.filters.balance = filterValue;
    }
    this.loadCustomers(undefined, true);
  };

  updateSelectedTab = (event: any) => {
    console.log(this._location.path());
    this.selectedTab = event.detail.value;
    // this._location.replaceState(
    //   this._location.path() + `?type=${this.selectedTab}`
    // );
    this.navigateWithQuery({ type: this.selectedTab });
    this.loadCustomers(undefined, true);
    this.loadStorePartiesTotalBalance();
    this.filterSortOptions.searchPlaceholder = `Search by ${this.selectedTab} name`;
  };

  navigateWithQuery(queryParams: any, replace?: boolean) {
    this.router.navigate([], {
      queryParams,
      queryParamsHandling: replace ? undefined : 'merge',
    });
  }
  goToPage = (page: number) => {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Fetch the data for the selected page or update the list accordingly
      this.loadCustomers();
    }
  };

  loadMoreData(event: any) {
    console.log('load more daa', event);
    if (event) {
      this.currentPage = this.currentPage + 1;
      this.loadCustomers(() => event.target.complete());
    }
  }

  changePageSize = (pageSize: number) => {
    console.log(pageSize);
    this.pageSize = pageSize;
    this.loadCustomers();
    // Fetch the data for the new page size or update the list accordingly
  };
  ledgerData: LedgerDataI = {
    ledgerItems: [],
    onSort: this.toggleSort,
    isLoading: this.isCustomersLoading,
    currentPage: this.currentPage,
    totalPages: this.totalPages,
    goToPage: this.goToPage,
    changePageSize: this.changePageSize,
    col1Title: 'Name',
    col2Title: 'Amount',
    onSelectionToggle: (event: any, partyId: string) => {
      this.onPartySelectionToggle(event, partyId);
    },
    onLongPress: () => {
      this.onLongPress();
    },
    selectAllToggle: (event) => {
      this.selectAllToggle(event);
    },
    enableMultiSelect: this.enableMultiSelect,
    isSelected: (id) => {
      return this.isPartySelected(id);
    },
  };
  ngOnInit() {
    this.currentPartyId = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as string;
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params);
      const queryType = params['type'];
      if (queryType) {
        this.selectedTab = queryType;
      } else {
        this.navigateWithQuery({ type: PartyTypeEnum.CUSTOMER });
        this.selectedTab = PartyTypeEnum.CUSTOMER;
      }
    });
    this.screenState$ = this.store.select((store) => store.screen);
    this.screenState$.subscribe((screen) => {
      this.isMobile = screen.isMobile;
      this.enableMultiSelect = !this.isMobile;
    });
    this.currentStoreInfoService.getCurrentStoreInfo().subscribe((response) => {
      this.currentStoreInfo = response;
      this.loadCustomers();
      this.loadStorePartiesTotalBalance();
    });
    this.store
      .select((store) => store.parties)
      .subscribe((parties) => {
        this.parties = parties.partiesList;
        this.updateLedgerData();
      });
  }

  ngDoCheck() {
    this.ledgerData = {
      ledgerItems: this.ledgerData.ledgerItems,
      onSort: this.toggleSort,
      isLoading: this.isCustomersLoading,
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      goToPage: this.goToPage,
      changePageSize: this.changePageSize,
      col1Title: 'Name',
      col2Title: 'Amount',
      onSelectionToggle: (event: any, partyId: string) => {
        this.onPartySelectionToggle(event, partyId);
      },
      onLongPress: () => {
        this.onLongPress();
      },
      selectAllToggle: (event) => {
        this.selectAllToggle(event);
      },
      enableMultiSelect: this.enableMultiSelect,
      isSelected: (id) => {
        return this.isPartySelected(id);
      },
    };
  }
  onViewReportsClicked = () => {};

  openPartyDetailsPage = (customerId: string) => {
    console.log('openPartyDetailsPage');
    this.router.navigate([`party/${customerId}`], {
      queryParams: { type: this.selectedTab },
    });
  };

  deleteParties = (onDeleteSuccessful?: () => {}) => {
    const partyIds = this.selectedParties;
    const storeId = this.currentStoreInfo?._id;
    if (!storeId) {
      return;
    }
    return this.partiesService
      .deleteStoreParties(storeId, this.party, partyIds)
      .subscribe({
        next: (response) => {
          //@ts-ignore
          console.log(response?.body);
          if (onDeleteSuccessful) {
            onDeleteSuccessful();
            this.selectedParties.map((partyId) =>
              this.store.dispatch(deletePartyInList({ party: partyId }))
            );
            this.selectedParties = [];
          }
          toastAlert(this.toastContoller, 'Parties deleted successfully');
        },
        error: (error) => {},
        complete: () => {},
      });
  };

  async openDeleteConfirmationModal() {
    const modal = await this.modalController.create({
      component: ConfirmationModalComponent,
      componentProps: {
        confirmationModalInput: {
          headerTitle: 'Delete parties',
          body: {
            title: 'Are you sure?',
            icon: {
              name: 'close-circle-outline',
              class: 'danger',
            },
            subText:
              'Do you really want to delete these parties? This process cannot be undone',
          },
          ctaButton: {
            text: 'Delete',
            class: 'danger',
            onClick: () => {
              console.log('confirm clicked');
              this.deleteParties(() => modal.dismiss());
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
  onLongPress = () => {
    console.log('long');
    this.enableMultiSelect = true;
  };

  openPartyDetails = (customerId: string) => {
    this._location.replaceState(
      `parties/${customerId}?type=${this.selectedTab}`
    );
    console.log('openPartyDetails');
    this.isMobile ? this.openPartyDetailsPage(customerId) : null;
  };

  onCustomerLedgerCardClicked = (ledger: LedgerItemI) => {
    this.openPartyDetails(ledger.id);
  };

  onOpenDetailsPage = (ledger: LedgerItemI) => {
    console.log('onOpenDetailsPage');

    this.openPartyDetailsPage(ledger.id);
  };

  onPartySelectionToggle = (event: any, partyId: string) => {
    if (event.detail.checked) {
      this.selectedParties.push(partyId);
    }
    if (event.detail.checked === false) {
      const deleteIndex = this.selectedParties.findIndex(
        (selectedPartyId) => selectedPartyId === partyId
      );
      this.selectedParties.splice(deleteIndex, 1);
    }
    console.log(this.selectedParties);
  };
  selectAllToggle = (event: any) => {
    if (event.detail.checked) {
      const selected = this.parties.map((resp) => {
        if ('customer' in resp) {
          return resp.customer._id;
        } else {
          return resp._id;
        }
      });
      if (selected) {
        this.selectedParties = selected;
      }
    }
    if (event.detail.checked === false) {
      this.selectedParties = [];
    }
  };

  onMultipleSelectCancel() {
    this.selectedParties = [];
  }

  loadStorePartiesTotalBalance() {
    if (!this.currentStoreInfo?._id) {
      return;
    }

    this.partiesService
      .getStorePartiesTotalBalance(this.currentStoreInfo?._id, this.selectedTab)
      .subscribe({
        next: (v) => {
          //@ts-ignore
          this.totalBalance = v.body;
          this.creditDebitSummaryData = {
            debit: {
              title: "You'll give",
              amount: Math.abs(
                this.totalBalance?.totalBalanceLessThanZero || 0
              ),
              color: 'green',
            },
            credit: {
              title: "You'll get",
              amount: this.totalBalance?.totalBalanceGreaterThanZero || 0,
              color: 'red',
            },
            ctaButton: {
              title: 'View Reports',
              icon: 'sds',
              onClick: this.onViewReportsClicked,
            },
          };
          this.createInjector();
        },
        error: (e) => console.error(e),
        complete: () => console.info('complete'),
      });
  }

  updateLedgerData() {
    this.ledgerData.ledgerItems = this.parties.map((party) => {
      let ledgerItem: LedgerItemI;
      if ('customer' in party) {
        const customerData = party.customer;
        const customerInfoData = party.customerStoreInfo;
        ledgerItem = {
          id: customerInfoData.customerId,
          title: customerInfoData.name || '',
          amount: {
            text: Math.abs(customerInfoData.balance || 0)?.toString(),
            color:
              customerInfoData &&
              customerInfoData.balance &&
              customerInfoData.balance > 0
                ? 'danger'
                : customerInfoData &&
                  customerInfoData.balance &&
                  customerInfoData.balance < 0
                ? 'success'
                : '',
          },
          subTitle: customerData.phoneNumber,
          imageUrl: customerData.photoUrl,
          onClick: this.onCustomerLedgerCardClicked,
          openDetailsPage: this.onOpenDetailsPage,
        };
        return ledgerItem;
      } else {
        const supplierData = party;
        ledgerItem = {
          id: supplierData._id,
          title: supplierData.name || '',
          amount: {
            text: Math.abs(supplierData.balance || 0)?.toString(),
            color:
              supplierData && supplierData.balance && supplierData.balance > 0
                ? 'danger'
                : supplierData &&
                  supplierData.balance &&
                  supplierData.balance < 0
                ? 'success'
                : '',
          },
          subTitle: supplierData.phoneNumber,
          imageUrl: supplierData.photoUrl,
          onClick: this.onCustomerLedgerCardClicked,
          openDetailsPage: this.onOpenDetailsPage,
        };
        return ledgerItem;
      }
    });
  }

  isPartySelected = (partyId: string) => {
    return !!this.selectedParties.find(
      (selectedPartyId) => selectedPartyId === partyId
    );
  };

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
    console.log(1);
    this.partiesService
      .getAllStoreParties(this.currentStoreInfo?._id, this.selectedTab, {
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
            console.log(response.body.parties);
            //@ts-ignore
            const newParties =
              this.isMobile && !isReload
                ? //@ts-ignore
                  [...this.parties, ...response.body.parties]
                : //@ts-ignore
                  [...response.body.parties];
            this.store.dispatch(setPartiesList({ partiesList: newParties }));
            //@ts-ignore

            !this.isMobile &&
            !this.currentPartyId &&
            'customer' in this.parties[0]
              ? this.openPartyDetails(this.parties[0].customer._id)
              : !this.isMobile &&
                !this.currentPartyId &&
                '_id' in this.parties[0]
              ? this.openPartyDetails(this.parties[0]._id)
              : null;

            //@ts-ignore
            const pagination = response.body.pagination;
            this.currentPage = pagination.page;
            this.pageSize = pagination.pageSize;
            this.totalPages = pagination.totalPages;
          }
        },
        (error) => {},
        () => {
          this.isCustomersLoading = false;
          onLoadingFinished && onLoadingFinished();
        }
      );
    console.log(3);
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

  resetPagination() {
    this.currentPage = 1;
    this.totalPages = 1;
    this.pageSize = 10;
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
}
