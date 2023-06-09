import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ScreenModel } from 'src/app/store/models/screen.models';
import { AppState } from 'src/app/store/models/state.model';
import { PaginationComponentComponent } from '../pagination-component/pagination-component.component';

@Component({
  selector: 'app-credit-debit-ledger-list',
  templateUrl: './credit-debit-ledger-list.component.html',
  styleUrls: ['./credit-debit-ledger-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, PaginationComponentComponent],
})
export class CreditDebitLedgerListComponent implements OnInit {
  @Input() ledgerData!: LedgerDataI;
  public screenState$: Observable<ScreenModel> | undefined;
  isMobile = false;
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.screenState$ = this.store.select((store) => store.screen);
    this.screenState$.subscribe((screen) => (this.isMobile = screen.isMobile));
  }
}

export interface LedgerItemI {
  title?: string;
  subTitle?: string;
  chipText?: string;
  amount?: string;
  amountSubtitle?: string;
  imageUrl?: string;
  onClick: (ledger: LedgerItemI) => void;
  openDetailsPage: (ledger: LedgerItemI) => void;
}

export interface LedgerDataI {
  ledgerItems: LedgerItemI[];
  onAmountSort: () => void;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  goToPage: (event: any) => void;
  changePageSize: (event: any) => void;
  col1Title: string;
  col2Title: string;
}
