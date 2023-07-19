import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StoreInfoModel } from '../../../store/models/userStoreInfo.models';
import {
  GetAllCustomersResponseI,
  PartiesFilterByQueryI,
  PartiesService,
  PartyTypeEnum,
  SupplierI,
} from '../../services/parties/parties.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CurrentStoreInfoService } from '../../services/currentStore/current-store-info.service';

@Component({
  selector: 'app-party-selection',
  templateUrl: './party-selection.component.html',
  styleUrls: ['./party-selection.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class PartySelectionComponent implements OnInit {
  partyCurrentPage = 1;
  partyTotalPages = 100;
  partyPageSize = 10;
  isPartiesLoading = false;
  currentStoreInfo: StoreInfoModel | undefined;
  @Input() selectedPartyTab!: PartyTypeEnum;
  filters: PartiesFilterByQueryI = {};
  parties: Array<GetAllCustomersResponseI | SupplierI> = [];
  @Output() onSelect: EventEmitter<GetAllCustomersResponseI | SupplierI> =
    new EventEmitter<GetAllCustomersResponseI | SupplierI>();

  constructor(
    private partiesService: PartiesService,
    private currentStoreInfoService: CurrentStoreInfoService
  ) {}

  ngOnInit() {
    this.currentStoreInfoService.getCurrentStoreInfo().subscribe((response) => {
      this.currentStoreInfo = response;
      this.loadParties();
    });
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

  onSelectEvent(event: GetAllCustomersResponseI | SupplierI) {
    if (event) {
      this.onSelect.emit(event);
    }
  }

  loadParties(onLoadingFinished?: () => void, isReload?: boolean) {
    if (isReload) {
      this.resetPagination();
    }
    if (this.isPartiesLoading) {
      return;
    }
    if (!this.currentStoreInfo?._id) {
      return;
    }

    this.isPartiesLoading = true;
    this.partiesService
      .getAllStoreParties(this.currentStoreInfo?._id, this.selectedPartyTab, {
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
          this.isPartiesLoading = false;
          onLoadingFinished && onLoadingFinished();
        }
      );
  }
}
