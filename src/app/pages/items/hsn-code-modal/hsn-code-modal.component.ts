import { CommonModule } from '@angular/common';
import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { DialogHeaderComponent } from 'src/app/core/components/dialog-header/dialog-header.component';
import { ItemNotFoundComponent } from 'src/app/core/components/item-not-found/item-not-found.component';
import {
  PartiesService,
  PartyTypeEnum,
} from 'src/app/core/services/parties/parties.service';
import {
  ItemTypeEnum,
  ProductsService,
  SortOrder,
} from 'src/app/core/services/products/products.service';

@Component({
  selector: 'app-hsn-code-modal',
  templateUrl: './hsn-code-modal.component.html',
  styleUrls: ['./hsn-code-modal.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    DialogHeaderComponent,
    FormsModule,
    ItemNotFoundComponent,
  ],
})
export class HsnCodeModalComponent implements OnInit, DoCheck {
  @Input() itemType!: ItemTypeEnum;
  hsnCodes: HSNSACCodeI[] = [];
  newItem: string | undefined;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  isLoading = false;
  search: string | undefined = '';
  sortBy: string = 'name';
  sortOrder: SortOrder = 'asc';
  disabled: boolean = true;
  constructor(
    public popoverController: ModalController,
    private productsService: ProductsService
  ) {}

  ngDoCheck(): void {
    console.log(this.newItem, this.newItem !== this.search);
    if (this.newItem !== this.search) {
      this.loadHSNCodes(undefined, true);
      if (this.newItem) {
        this.disabled = typeof Number(this.newItem) === 'number';
      }
    }
  }

  ngOnInit() {
    this.loadHSNCodes();
  }

  resetPagination() {
    this.currentPage = 1;
    this.totalPages = 1;
    this.pageSize = 10;
  }

  loadHSNCodes(onLoadingFinished?: () => void, isReload?: boolean) {
    console.log('load');
    if (isReload) {
      this.resetPagination();
    }
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    console.log(1);
    this.productsService
      .getHSNCodes(this.itemType, {
        page: this.currentPage.toString(),
        pageSize: this.pageSize.toString(),
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
        //@ts-ignore
        search: this.newItem,
      })
      .subscribe(
        (response) => {
          console.log(2);

          //@ts-ignore
          if (response.message === 'Success') {
            //@ts-ignore
            console.log(response.body.hsnCodes);
            //@ts-ignore
            this.hsnCodes = !isReload
              ? //@ts-ignore
                [...this.hsnCodes, ...response.body.hsnCodes]
              : //@ts-ignore

                [...response.body.hsnCodes];
            //@ts-ignore
            const pagination = response.body.pagination;
            this.currentPage = pagination.page;
            this.pageSize = pagination.pageSize;
            this.totalPages = pagination.totalPages;
            console.log('this.hsnCodes', this.hsnCodes);
          }
        },
        (error) => {},
        () => {
          this.isLoading = false;
          onLoadingFinished && onLoadingFinished();
          this.search = this.newItem;
        }
      );
    console.log(3);
  }

  onClosePopover = () => {
    this.popoverController.dismiss();
  };
  selectItem(item: HSNSACCodeI) {
    this.popoverController.dismiss({ selectedValue: item });
  }

  addItem() {
    if (this.newItem) {
      // this.itemList.push(this.newItem);
      this.popoverController.dismiss({
        selectedValue: { code: this.newItem },
      });
    }
  }

  loadMoreData(event: any) {
    console.log('daa', event);
    if (event) {
      this.currentPage = this.currentPage + 1;
      this.loadHSNCodes(() => event.target.complete());
    }
  }
}

export interface HSNSACCodeI {
  _id: string;
  code: string;
  description: string;
}
