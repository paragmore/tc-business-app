import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { IonSelect, IonicModule } from '@ionic/angular';
import { ClickOutsideDirective } from '../../directives/click-outside-directive';
import { FormsModule } from '@angular/forms';
import { CustomDropdownComponent } from 'src/app/custom-dropdown/custom-dropdown.component';
import { Observable } from 'rxjs';
import { ScreenModel } from 'src/app/store/models/screen.models';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/models/state.model';

@Component({
  selector: 'app-search-filter-sort',
  templateUrl: './search-filter-sort.component.html',
  styleUrls: ['./search-filter-sort.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ClickOutsideDirective, FormsModule],
})
export class SearchFilterSortComponent implements OnInit {
  isSearching = false;
  isMobile = false;
  @Output() onSearchSortFilter = new EventEmitter<SearchSortFilterEvent>();
  @Input() filterSortLists!: FilterSortListsI;
  @ViewChild(IonSelect) selectComponent: IonSelect | undefined;
  selectedValue: string | undefined;
  public screenState$: Observable<ScreenModel> | undefined;

  openDropdown(): void {
    this.selectComponent?.open();
  }
  constructor(private store: Store<AppState>) {}
  handleOptionSelected(option: string): void {
    // Handle the selected option here
    console.log('Selected Option:', option);
  }
  ngOnInit() {
    this.screenState$ = this.store.select((store) => store.screen);
    this.screenState$.subscribe((screen) => (this.isMobile = screen.isMobile));
  }
  onSearchClicked = () => {
    this.isSearching = true;
  };

  hideSearchBar() {
    this.isSearching = false;
  }

  onFilter(selected: FilterSortListItemI) {
    this.onSearchSortFilter.emit({
      type: SearchSortFilterEventTypeEnum.FILTER,
      selected,
    });
  }

  onSort(selected: FilterSortListItemI) {
    this.onSearchSortFilter.emit({
      type: SearchSortFilterEventTypeEnum.FILTER,
      selected,
    });
  }
}

export interface FilterSortListItemI {
  value: string;
  text: string;
}
export interface FilterSortListsI {
  filter: FilterSortListItemI[];
  sort: FilterSortListItemI[];
}

export interface SearchSortFilterEvent {
  type: SearchSortFilterEventTypeEnum;
  selected: FilterSortListItemI;
}

export enum SearchSortFilterEventTypeEnum {
  SEARCH = 'search',
  SORT = 'sort',
  FILTER = 'filter',
}
