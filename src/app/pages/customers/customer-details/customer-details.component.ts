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
  GetAllCustomersResponseI,
  PartiesService,
  PartyTypeEnum,
  SupplierI,
} from 'src/app/core/services/parties/parties.service';
import { StoreInfoModel } from 'src/app/store/models/userStoreInfo.models';
import { PartyCreationModalComponent } from '../../parties/party-creation-modal/party-creation-modal.component';

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
  ],
})
export class CustomerDetailsComponent implements OnInit {
  currentPartyId: string | undefined;
  previousParams: any;
  currentStoreInfo: StoreInfoModel | undefined;
  partyDetails: GetAllCustomersResponseI | SupplierI | undefined;
  basicPartyDetails: BasicPartyDetailsInputI | undefined;
  partyType = PartyTypeEnum.CUSTOMER;
  addresses: Array<AdrressesI> | undefined;
  gstin: string | undefined;
  // Define dummy data
  dummyData: EntriesLedgerDataI = {
    ledgerItems: [
      {
        col1: {
          text: 'Item 1',
          subtext: 'Subtext 1',
          color: 'red',
        },
        col2: {
          text: 'Item 2',
          subtext: 'Subtext 2',
          color: 'blue',
        },
        col3: {
          text: 'Item 3',
          subtext: 'Subtext 3',
          color: 'green',
        },
        onClick: (ledger: EntriesLedgerItemI) => {
          // Handle onClick logic here
          console.log('Clicked on ledger item:', ledger);
        },
        openItemDetailsPage: (ledger: EntriesLedgerItemI) => {
          // Handle openItemDetailsPage logic here
          console.log('Opened item details page for ledger:', ledger);
        },
      },
      // Add more ledger items as needed
    ],
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
    col1Title: 'Column 1',
    col2Title: 'Column 2',
    col3Title: 'Column 3',
  };

  constructor(
    private _location: Location,
    private partiesService: PartiesService,
    private currentStoreInfoService: CurrentStoreInfoService,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController
  ) {}
  ngOnInit() {
    combineLatest([
      this.currentStoreInfoService.getCurrentStoreInfo(),
    ]).subscribe({
      next: (v) => {
        const [currentStoreInfoResponse] = v;
        this.currentStoreInfo = currentStoreInfoResponse;
        this.getStoreCustomerById();
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete'),
    });
    this.getInitialStoreCustomer();
    this._location.onUrlChange((url, state) => {
      console.log('kssss', this.currentPartyId);
      // Extract the id
      const idRegex = /parties\/(\w+)/;
      const idMatch = url.match(idRegex);
      const id = idMatch && idMatch[1];

      // Extract the type
      const typeRegex = /type=(\w+)/;
      const typeMatch = url.match(typeRegex);
      const type = typeMatch && typeMatch[1];

      this.currentPartyId = id as string;
      this.partyType = type as PartyTypeEnum;
      this.getStoreCustomerById();
    });
    console.log('kss', this.currentPartyId);
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
    this.getStoreCustomerById();
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
          this.partyDetails = response.body;
          let subtitle = '';
          if (this.partyDetails && 'customer' in this.partyDetails) {
            const email = this.partyDetails?.customerStoreInfo?.email;
            const phNumber = this.partyDetails?.customer?.phoneNumber;
            this.addresses = this.partyDetails.customerStoreInfo?.addresses;
            this.gstin = this.partyDetails.customerStoreInfo?.gstin;
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
                value: Math.abs(
                  this.partyDetails?.customerStoreInfo.balance || 0
                ),
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
                  this.partyDetails &&
                  this.partyDetails &&
                  this.partyDetails.balance
                    ? this.partyDetails.balance < 0
                      ? 'success'
                      : 'danger'
                    : '',
                prefix:
                  this.partyDetails &&
                  this.partyDetails &&
                  this.partyDetails.balance
                    ? this.partyDetails.balance < 0
                      ? "You'll give"
                      : "You'll get"
                    : '',
              },
              onEditClick: this.openEditCustomerModal,
            };
          }
        }
      });
  }
}
