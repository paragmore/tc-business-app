import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ScreenModel } from 'src/app/store/models/screen.models';
import { AppState } from 'src/app/store/models/state.model';
import { HyphenPipe } from '../../pipes/hyphen.pipe';
import { PaginationComponentComponent } from '../pagination-component/pagination-component.component';

@Component({
  selector: 'app-entries-ledger-list',
  templateUrl: './entries-ledger-list.component.html',
  styleUrls: ['./entries-ledger-list.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    HyphenPipe,
    PaginationComponentComponent,
  ],
})
export class EntriesLedgerListComponent implements OnInit {
  @Input() ledgerData!: EntriesLedgerDataI;
  isLoading = false;
  public screenState$: Observable<ScreenModel> | undefined;
  isMobile = false;
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.screenState$ = this.store.select((store) => store.screen);
    this.screenState$.subscribe((screen) => (this.isMobile = screen.isMobile));
  }
}

export interface EntriesLedgerItemColI {
  text: string;
  subtext?: string;
  color?: string;
}
export interface EntriesLedgerItemI {
  col1: EntriesLedgerItemColI;
  col2: EntriesLedgerItemColI;
  col3: EntriesLedgerItemColI;
  onClick: (ledger: EntriesLedgerItemI) => void;
  openItemDetailsPage: (ledger: EntriesLedgerItemI) => void;
}

export interface EntriesLedgerDataI {
  ledgerItems: EntriesLedgerItemI[];
  onSort: () => void;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  goToPage: (event: any) => void;
  changePageSize: (event: any) => void;
  col1Title: string;
  col2Title: string;
  col3Title: string;
}
