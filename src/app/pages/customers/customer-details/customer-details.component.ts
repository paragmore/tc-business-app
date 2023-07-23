import { CommonModule, Location } from '@angular/common';
import { Component, DoCheck, OnInit, inject } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { combineLatest } from 'rxjs';
import {
  BasicPartyDetailsComponent,
  BasicPartyDetailsInputI,
} from 'src/app/basic-party-details/basic-party-details.component';
import {
  EntriesLedgerDataI,
  EntriesLedgerItemI,
  EntriesLedgerListComponent,
} from 'src/app/core/components/entries-ledger-list/entries-ledger-list.component';
import { CurrentStoreInfoService } from 'src/app/core/services/currentStore/current-store-info.service';
import {
  AddressI,
  AdrressesI,
  CustomerI,
  CustomerStoreInfoI,
  GetAllCustomersResponseI,
  PartiesService,
  PartyTypeEnum,
  SupplierI,
} from 'src/app/core/services/parties/parties.service';
import { StoreInfoModel } from 'src/app/store/models/userStoreInfo.models';
import { PartyCreationModalComponent } from '../../parties/party-creation-modal/party-creation-modal.component';
import { RightHeaderComponent } from 'src/app/right-header/right-header.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/models/state.model';
import { setSelectedParty } from 'src/app/store/actions/parties.action';
import {
  SortOrder,
  TransactionOverviewI,
  TransactionTypeEnum,
  TransactionsOverviewFilterByI,
  TransactionsService,
} from 'src/app/core/services/transactions/transactions.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    BasicPartyDetailsComponent,
    EntriesLedgerListComponent,
    RightHeaderComponent,
  ],
})
export class CustomerDetailsComponent implements OnInit {
  currentPage = 1;
  totalPages = 100;
  pageSize = 10;
  sortBy: string = 'name';
  sortOrder: SortOrder = 'asc';
  isTransactionsOverviewLoading = false;
  isMobile = false;
  currentPartyId: string | undefined;
  previousParams: any;
  currentStoreInfo: StoreInfoModel | undefined;
  partyDetails: GetAllCustomersResponseI | SupplierI | undefined;
  basicPartyDetails: BasicPartyDetailsInputI | undefined;
  partyType = PartyTypeEnum.CUSTOMER;
  addresses: Array<AdrressesI> | undefined;
  parsedPartyDetails: CustomerStoreInfoI | SupplierI | undefined;
  gstin: string | undefined;
  filters: TransactionsOverviewFilterByI = {};
  transactionOverviews: TransactionOverviewI[] = [];
  // Define dummy data
  ledgerData: EntriesLedgerDataI = {
    ledgerItems: [],
    onSort: () => {
      // Handle onSort logic here
      console.log('Sorting...');
    },
    isLoading: false,
    currentPage: 1,
    totalPages: 5,
    goToPage: (event: any) => {
      // Handle goToPage logic here
      console.log('Go to page:', event.target.value);
    },
    changePageSize: (event: any) => {
      // Handle changePageSize logic here
      console.log('Change page size:', event.target.value);
    },
    col1Title: 'Entries',
    col2Title: 'You Gave',
    col3Title: 'You Got',
  };

  ngDoCheck() {
    // this.ledgerData = {
    //   ledgerItems: this.ledgerData.ledgerItems,
    //   onSort: this.toggleSort,
    //   isLoading: this.isTransactionsOverviewLoading,
    //   currentPage: this.currentPage,
    //   totalPages: this.totalPages,
    //   goToPage: this.goToPage,
    //   changePageSize: this.changePageSize,
    //   col1Title: 'Name',
    //   col2Title: 'Amount',
    //   onSelectionToggle: (event: any, partyId: string) => {
    //     this.onTransactionSelectionToggle(event, partyId);
    //   },
    //   onLongPress: () => {
    //     this.onLongPress();
    //   },
    //   selectAllToggle: (event) => {
    //     this.selectAllToggle(event);
    //   },
    //   enableMultiSelect: this.enableMultiSelect,
    //   isSelected: (id) => {
    //     return this.isTransactionSelected(id);
    //   },
    //   getNotFoundInput: () => {
    //     return this.getNotFoundInput();
    //   },
    // };
  }

  constructor(
    private _location: Location,
    private partiesService: PartiesService,
    private currentStoreInfoService: CurrentStoreInfoService,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private store: Store<AppState>,
    private transactionsService: TransactionsService
  ) {}
  ngOnInit() {
    this._location.onUrlChange((url, state) => {
      // Extract the id
      const idRegex = /parties\/(\w+)/;
      const idMatch = url.match(idRegex);
      const id = idMatch && idMatch[1];

      // Extract the type
      const typeRegex = /type=(\w+)/;
      const typeMatch = url.match(typeRegex);
      const type = typeMatch && typeMatch[1];

      this.currentPartyId = id as string;
      this.filters = {
        partyId: this.currentPartyId,
      };
      this.partyType = type as PartyTypeEnum;
      this.getStoreCustomerById();
      this.loadTransactionsOverview();
    });
    combineLatest([
      this.currentStoreInfoService.getCurrentStoreInfo(),
    ]).subscribe({
      next: (v) => {
        const [currentStoreInfoResponse] = v;
        this.currentStoreInfo = currentStoreInfoResponse;
        this.getStoreCustomerById();

        this.loadTransactionsOverview();
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete'),
    });
    this.getInitialStoreCustomer();
    this.store
      .select((store) => store.parties)
      .subscribe((parties) => {
        this.partyDetails = parties.selectedParty;
        this.updateBasicPartyDetails();
      });
    console.log('kss', this.currentPartyId);
  }

  updateLedgerData() {
    this.ledgerData.ledgerItems = this.transactionOverviews.map(
      (transactionOverview) => {
        let ledgerItem: EntriesLedgerItemI;
        ledgerItem = {
          col1: {
            text: format(new Date(transactionOverview.date), 'dd MMM yyyy'),
            color: '',
            subtext: '',
          },
          col2: { text: '', color: 'danger', subtext: '' },
          col3: { text: '', color: 'success', subtext: '' },
          onClick: (led) => {},
          openItemDetailsPage: (l) => {},
        };
        if (this.partyType === PartyTypeEnum.CUSTOMER) {
          if (
            transactionOverview.transactionType === TransactionTypeEnum.SALE
          ) {
            ledgerItem.col2 = {
              text:
                'amount' in transactionOverview.transactionId
                  ? transactionOverview.transactionId.amount.toString()
                  : transactionOverview.transactionId.totalInformation.total.toString(),
            };
          }
          if (
            transactionOverview.transactionType === TransactionTypeEnum.PAYMENT
          ) {
            ledgerItem.col3 = {
              text:
                'amount' in transactionOverview.transactionId
                  ? transactionOverview.transactionId.amount.toString()
                  : transactionOverview.transactionId.totalInformation.total.toString(),
            };
          }
        } else {
          if (
            transactionOverview.transactionType === TransactionTypeEnum.SALE
          ) {
            ledgerItem.col3 = {
              text:
                'amount' in transactionOverview.transactionId
                  ? transactionOverview.transactionId.amount.toString()
                  : transactionOverview.transactionId.totalInformation.total.toString(),
            };
          }
          if (
            transactionOverview.transactionType === TransactionTypeEnum.PAYMENT
          ) {
            ledgerItem.col2 = {
              text:
                'amount' in transactionOverview.transactionId
                  ? transactionOverview.transactionId.amount.toString()
                  : transactionOverview.transactionId.totalInformation.total.toString(),
            };
          }
        }

        return ledgerItem;
      }
    );
  }

  updateBasicPartyDetails() {
    let subtitle = '';
    if (this.partyDetails && 'customer' in this.partyDetails) {
      const email = this.partyDetails?.customerStoreInfo?.email;
      const phNumber = this.partyDetails?.customer?.phoneNumber;
      this.addresses = this.partyDetails.customerStoreInfo?.addresses;
      this.gstin = this.partyDetails.customerStoreInfo?.gstin;
      this.parsedPartyDetails = this.partyDetails.customerStoreInfo;
      if (phNumber && email) {
        subtitle = `${phNumber} | ${email}`;
      } else if (phNumber) {
        subtitle = phNumber;
      } else if (email) {
        subtitle = email;
      }

      this.basicPartyDetails = {
        // avatarUrl: 'https://example.com/avatar.jpg',
        name: this.partyDetails?.customerStoreInfo.name || '',
        subtitle: subtitle,
        amount: {
          title: 'Total Amount',
          value: Math.abs(this.partyDetails?.customerStoreInfo.balance || 0),
          color:
            this.partyDetails &&
            this.partyDetails.customerStoreInfo &&
            this.partyDetails.customerStoreInfo.balance
              ? this.partyDetails.customerStoreInfo.balance < 0
                ? 'success'
                : 'danger'
              : '',
          prefix:
            this.partyDetails &&
            this.partyDetails.customerStoreInfo &&
            this.partyDetails.customerStoreInfo.balance
              ? this.partyDetails.customerStoreInfo.balance < 0
                ? "You'll give"
                : "You'll get"
              : '',
        },
        onEditClick: this.openEditCustomerModal,
      };
    } else {
      const email = this.partyDetails?.email;
      const phNumber = this.partyDetails?.phoneNumber;
      this.addresses = this.partyDetails?.addresses;
      this.gstin = this.partyDetails?.gstin;
      this.parsedPartyDetails = this.partyDetails;

      if (phNumber && email) {
        subtitle = `${phNumber} | ${email}`;
      } else if (phNumber) {
        subtitle = phNumber;
      } else if (email) {
        subtitle = email;
      }

      this.basicPartyDetails = {
        // avatarUrl: 'https://example.com/avatar.jpg',
        name: this.partyDetails?.name || '',
        subtitle: subtitle,
        amount: {
          title: 'Total Amount',
          value: Math.abs(this.partyDetails?.balance || 0),
          color:
            this.partyDetails && this.partyDetails && this.partyDetails.balance
              ? this.partyDetails.balance < 0
                ? 'success'
                : 'danger'
              : '',
          prefix:
            this.partyDetails && this.partyDetails && this.partyDetails.balance
              ? this.partyDetails.balance < 0
                ? "You'll give"
                : "You'll get"
              : '',
        },
        onEditClick: this.openEditCustomerModal,
      };
    }
  }

  openEditCustomerModal = async () => {
    const modal = await this.modalController.create({
      component: PartyCreationModalComponent,
      componentProps: {
        editParty: {
          ...this.partyDetails,
        },
        partyType: this.partyType,
      },
      backdropDismiss: true,
      cssClass: 'side-modal',
    });

    modal.onDidDismiss().then((modalData) => {});
    return await modal.present();
  };

  getInitialStoreCustomer() {
    this.currentPartyId = this.activatedRoute.snapshot.params['id'];
    this.filters = {
      partyId: this.currentPartyId,
    };
    this.partyType = this.activatedRoute.snapshot.queryParams['type'];
    this.getStoreCustomerById();
    this.loadTransactionsOverview();
  }

  resetPagination() {
    this.currentPage = 1;
    this.totalPages = 1;
    this.pageSize = 10;
  }

  loadTransactionsOverview(onLoadingFinished?: () => void, isReload?: boolean) {
    if (isReload) {
      this.resetPagination();
    }
    if (this.isTransactionsOverviewLoading) {
      return;
    }
    if (!this.currentStoreInfo?._id) {
      return;
    }
    this.isTransactionsOverviewLoading = true;
    console.log(1);
    this.transactionsService
      .getAllStoreTransactionsOverview(this.currentStoreInfo?._id, {
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
            console.log(response.body.transactions);
            //@ts-ignore
            const newTransactions =
              this.isMobile && !isReload
                ? //@ts-ignore
                  [...this.transactions, ...response.body.transactions]
                : //@ts-ignore
                  [...response.body.transactions];
            // this.store.dispatch(
            //   setTransactionsList({ transactionsList: newTransactions })
            // );

            //@ts-ignore
            const pagination = response.body.pagination;
            this.currentPage = pagination.page;
            this.pageSize = pagination.pageSize;
            this.totalPages = pagination.totalPages;
            //@ts-ignore

            // !this.isMobile &&
            // !this.currentTransactionId &&
            // !this.isMobile &&
            // !this.currentTransactionId &&
            // '_id' in this.transactions[0]
            //   ? this.openTransactionDetails(this.transactions[0]._id)
            //   : null;
          }
        },
        (error) => {},
        () => {
          this.isTransactionsOverviewLoading = false;
          onLoadingFinished && onLoadingFinished();
        }
      );
    console.log(3);
  }

  getStoreCustomerById() {
    if (!this.currentStoreInfo?._id || !this.currentPartyId) {
      return;
    }
    this.partiesService
      .getStorePartyById(
        this.currentStoreInfo?._id,
        this.partyType,
        this.currentPartyId
      )
      .subscribe((response) => {
        console.log(response);
        //@ts-ignore
        if (response.message === 'Success') {
          //@ts-ignore
          const newPartyDetails = response.body;
          this.store.dispatch(
            setSelectedParty({ selectedParty: newPartyDetails })
          );
        }
      });
  }
}
