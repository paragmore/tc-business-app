import { CommonModule, Location } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { format } from 'date-fns';
import { combineLatest } from 'rxjs';
import {
  BasicPartyDetailsComponent,
  BasicPartyDetailsInputI,
} from 'src/app/basic-party-details/basic-party-details.component';
import { CurrentStoreInfoService } from 'src/app/core/services/currentStore/current-store-info.service';
import {
  PaymentStatusEnum,
  TransactionI,
  TransactionTypeEnum,
  TransactionsService,
} from 'src/app/core/services/transactions/transactions.service';
import { setSelectedTransaction } from 'src/app/store/actions/transactions.action';
import { AppState } from 'src/app/store/models/state.model';
import { StoreInfoModel } from 'src/app/store/models/userStoreInfo.models';
import { toJpeg, toPng } from 'html-to-image';
import { InvoiceTemplatePreviewComponent } from 'src/app/core/components/invoice-template-preview/invoice-template-preview.component';
import { RightHeaderComponent } from 'src/app/right-header/right-header.component';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    BasicPartyDetailsComponent,
    InvoiceTemplatePreviewComponent,
    RightHeaderComponent,
  ],
})
export class TransactionDetailsComponent implements OnInit, AfterViewInit {
  currentTransactionId: string | undefined;
  transactionType = TransactionTypeEnum.SALE;
  currentStoreInfo: StoreInfoModel | undefined;
  transactionDetails: TransactionI | undefined;
  basicPartyDetails: BasicPartyDetailsInputI | undefined;
  htmlTemplate = `
  <html>
    <head>
      <style>
        /* Add your custom styles here */
      </style>
    </head>
    <body>
      <!-- Your HTML template content goes here -->
      <div>
      Hello this is invoice</div>
    </body>
  </html>
`;
  constructor(
    private _location: Location,
    private transactionsService: TransactionsService,
    private currentStoreInfoService: CurrentStoreInfoService,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private store: Store<AppState>
  ) {}
  ngAfterViewInit(): void {
    // this.convertHtmlToImage();
  }

  ngOnInit() {
    this._location.onUrlChange((url, state) => {
      // Extract the id
      const idRegex = /transactions\/(\w+)/;
      const idMatch = url.match(idRegex);
      const id = idMatch && idMatch[1];

      // Extract the type
      const typeRegex = /type=(\w+)/;
      const typeMatch = url.match(typeRegex);
      const type = typeMatch && typeMatch[1];

      this.currentTransactionId = id as string;
      this.transactionType = type as TransactionTypeEnum;
      this.getStoreTransactionById();
    });
    combineLatest([
      this.currentStoreInfoService.getCurrentStoreInfo(),
    ]).subscribe({
      next: (v) => {
        const [currentStoreInfoResponse] = v;
        this.currentStoreInfo = currentStoreInfoResponse;
        this.getStoreTransactionById();
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete'),
    });
    this.getInitialStoreTransaction();
    this.store
      .select((store) => store.transactions)
      .subscribe((transactions) => {
        this.transactionDetails = transactions.selectedTransaction;
        this.updateBasicTransactionDetails();
      });
  }

  updateBasicTransactionDetails() {
    let subtitle = '';
    const email = this.transactionDetails?.party?.email;
    const phNumber = this.transactionDetails?.party?.phoneNumber;

    if (phNumber && email) {
      subtitle = `${phNumber} | ${email}`;
    } else if (phNumber) {
      subtitle = phNumber;
    } else if (email) {
      subtitle = email;
    }

    if (!this.transactionDetails) {
      return;
    }
    this.basicPartyDetails = {
      // avatarUrl: 'https://example.com/avatar.jpg',
      name: this.transactionDetails?.party?.name || '',
      subtitle: subtitle,
      amount: {
        title: 'Total Amount',
        value: Math.abs(this.transactionDetails?.totalInformation.total || 0),
        color: '',
        prefix: '',
        subtitle: {
          text: this.transactionDetails?.paymentStatus,
          color: this.getPaymentStatusColor(
            this.transactionDetails?.paymentStatus
          ),
        },
      },
    };
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

  getFormattedDate(date: string | undefined) {
    if (date) {
      return format(new Date(date), 'dd MMM yyyy');
    }
    return;
  }

  async convertHtmlToImage() {
    const element = document.getElementById('invoice');
    // element.innerHTML = this.htmlTemplate;
    console.log(element);
    if (!element) {
      return;
    }
    toPng(element, { quality: 0.95 })
      .then((dataUrl) => {
        var img = new Image();
        console.log('DATA', dataUrl);
        img.src = dataUrl;
        document.getElementById('image')?.appendChild(img);
      })
      .catch(function (error: any) {
        console.error('Error generating invoice image:', error);
      });
  }

  openEditTransactionModal() {}

  getInitialStoreTransaction() {
    this.currentTransactionId = this.activatedRoute.snapshot.params['id'];
    this.transactionType = this.activatedRoute.snapshot.queryParams['type'];
    this.getStoreTransactionById();
  }

  getStoreTransactionById() {
    if (!this.currentStoreInfo?._id || !this.currentTransactionId) {
      return;
    }
    this.transactionsService
      .getStoreTransactionById(
        this.currentStoreInfo?._id,
        this.currentTransactionId
      )
      .subscribe((response) => {
        console.log(response);
        //@ts-ignore
        if (response.message === 'Success') {
          //@ts-ignore
          const newTransactionDetails = response.body;
          this.store.dispatch(
            setSelectedTransaction({
              selectedTransaction: newTransactionDetails,
            })
          );
        }
      });
  }
}
