import {
  Component,
  DoCheck,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import {
  CreditDebitLedgerListComponent,
  LedgerDataI,
  LedgerItemI,
} from 'src/app/core/components/credit-debit-ledger-list/credit-debit-ledger-list.component';
import {
  CreditDebitSummaryCardComponent,
  CreditDebitSummaryCardInputI,
} from 'src/app/core/components/credit-debit-summary-card/credit-debit-summary-card.component';
import { SearchFilterSortComponent } from 'src/app/core/components/search-filter-sort/search-filter-sort.component';
import { PartyCreationModalComponent } from '../../parties/party-creation-modal/party-creation-modal.component';
import {
  GetAllCustomersResponseI,
  PartiesService,
  PartyTypeEnum,
  StorePartiesTotalBalanceI,
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
  ],
})
export class CustomersListComponent implements OnInit, DoCheck {
  constructor(
    private modalController: ModalController,
    private partiesService: PartiesService,
    private currentStoreInfoService: CurrentStoreInfoService,
    private store: Store<AppState>,
    private router: Router,
    private _location: Location
  ) {}
  party: PartyTypeEnum = PartyTypeEnum.CUSTOMER;
  currentCustomerId: string | undefined;
  private activatedRoute = inject(ActivatedRoute);
  customers: GetAllCustomersResponseI[] = [];
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
  toggleSort = (sortBy: string, order: SortOrder) => {
    this.sortBy = sortBy;
    this.sortOrder = order;
    this.loadCustomers();
  };

  goToPage = (page: number) => {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Fetch the data for the selected page or update the list accordingly
      this.loadCustomers(page);
    }
  };

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
  };
  ngOnInit() {
    this.currentCustomerId = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as string;
    this.screenState$ = this.store.select((store) => store.screen);
    this.screenState$.subscribe((screen) => (this.isMobile = screen.isMobile));
    this.currentStoreInfoService.getCurrentStoreInfo().subscribe((response) => {
      this.currentStoreInfo = response;
      this.loadCustomers();
      this.loadStorePartiesTotalBalance();
    });
  }

  ngDoCheck() {
    console.log('hhheer');
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
    };
  }
  onViewReportsClicked = () => {};

  openCustomerDetailsPage = (customerId: string) => {
    this.router.navigate([`parties/customer/${customerId}`]);
  };

  openCustomerDetails = (customerId: string) => {
    this._location.replaceState(`parties/customers/${customerId}`);
    this.isMobile ? this.openCustomerDetailsPage(customerId) : null;
  };

  onCustomerLedgerCardClicked = (ledger: LedgerItemI) => {
    this.openCustomerDetails(ledger.id);
  };

  onOpenDetailsPage = (ledger: LedgerItemI) => {
    this.openCustomerDetailsPage(ledger.id);
  };

  loadStorePartiesTotalBalance() {
    if (!this.currentStoreInfo?._id) {
      return;
    }

    this.partiesService
      .getStorePartiesTotalBalance(
        this.currentStoreInfo?._id,
        PartyTypeEnum.CUSTOMER
      )
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
        },
        error: (e) => console.error(e),
        complete: () => console.info('complete'),
      });
  }

  loadCustomers(page?: number) {
    if (this.isCustomersLoading) {
      return;
    }
    if (!this.currentStoreInfo?._id) {
      return;
    }
    this.isCustomersLoading = true;
    console.log(1);
    this.partiesService
      .getAllStoreParties(this.currentStoreInfo?._id, PartyTypeEnum.CUSTOMER, {
        page: this.currentPage.toString(),
        pageSize: this.pageSize.toString(),
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
      })
      .subscribe(
        (response) => {
          console.log(2);

          //@ts-ignore
          if (response.message === 'Success') {
            //@ts-ignore
            console.log(response.body.parties);
            //@ts-ignore
            this.customers = [...response.body.parties];
            this.ledgerData.ledgerItems = this.customers.map((customer) => {
              const customerData = customer.customer;
              const customerInfoData = customer.customerStoreInfo;
              const ledgerItem: LedgerItemI = {
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
            });
            !this.isMobile &&
              !this.currentCustomerId &&
              this.openCustomerDetails(this.customers[0].customer._id);
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
        }
      );
    console.log(3);
  }
  async openAddCustomerModal() {
    const modal = await this.modalController.create({
      component: PartyCreationModalComponent,
      componentProps: { partyType: this.party },
      backdropDismiss: true,
      cssClass: 'side-modal',
    });

    modal.onDidDismiss().then((modalData) => {});
    return await modal.present();
  }
}
