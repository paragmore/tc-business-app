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
import { CreditDebitSummaryCardComponent } from 'src/app/core/components/credit-debit-summary-card/credit-debit-summary-card.component';
import { SearchFilterSortComponent } from 'src/app/core/components/search-filter-sort/search-filter-sort.component';
import { PartyCreationModalComponent } from '../../parties/party-creation-modal/party-creation-modal.component';
import { PartiesTabType } from '../../parties/parties.component';
import {
  GetAllCustomersResponseI,
  PartiesService,
  PartyTypeEnum,
} from 'src/app/core/services/parties/parties.service';
import { StoreInfoModel } from 'src/app/store/models/userStoreInfo.models';
import { SortOrder } from 'src/app/core/services/products/products.service';
import { Observable } from 'rxjs';
import { ScreenModel } from 'src/app/store/models/screen.models';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentStoreInfoService } from 'src/app/core/services/currentStore/current-store-info.service';
import { AppState } from 'src/app/store/models/state.model';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';

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
  party: PartiesTabType = 'customers';
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
  ledgerData: LedgerDataI = {
    ledgerItems: [],
    onAmountSort: () => {
      // Handle amount sorting
    },
    isLoading: this.isCustomersLoading,
    currentPage: this.currentPage,
    totalPages: this.totalPages,
    goToPage: (event: any) => {
      // Handle going to a specific page
    },
    changePageSize: (event: any) => {
      // Handle changing page size
    },
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
    });
  }

  ngDoCheck() {
    this.ledgerData.isLoading = this.isCustomersLoading;
    this.ledgerData.ledgerItems = this.customers.map((customer) => {
      const customerData = customer.customer;
      const customerInfoData = customer.customerStoreInfo;
      const ledgerItem: LedgerItemI = {
        title: customerInfoData.name,
        amount: customerInfoData.balance?.toString(),
        subTitle: customerData.phoneNumber,
        imageUrl: customerData.photoUrl,
        onClick: this.onCustomerLedgerCardClicked,
        openDetailsPage: this.onOpenDetailsPage,
      };
      return ledgerItem;
    });
  }
  onViewReportsClicked() {}

  async openCustomerDetailsPage(customerResponse: GetAllCustomersResponseI) {
    this.router.navigate([`parties/customer/${customerResponse.customer._id}`]);
  }

  openCustomerDetails(customerResponse: GetAllCustomersResponseI) {
    this._location.replaceState(
      `parties/customers/${customerResponse.customer._id}`
    );
    this.isMobile ? this.openCustomerDetailsPage(customerResponse) : null;
  }

  onCustomerLedgerCardClicked(ledger: LedgerItemI) {}

  onOpenDetailsPage(ledger: LedgerItemI) {}

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
            !this.isMobile &&
              !this.currentCustomerId &&
              this.openCustomerDetails(this.customers[0]);
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
