import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ScreenModel } from 'src/app/store/models/screen.models';
import { AppState } from 'src/app/store/models/state.model';
import { AdditionalFieldI } from '../../services/products/products.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-additional-fields-list',
  templateUrl: './additional-fields-list.component.html',
  styleUrls: ['./additional-fields-list.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true,
})
export class AdditionalFieldsListComponent implements OnInit {
  @Input() additionalFields?: AdditionalFieldI[];
  @Input() readonly = false;
  isMobile = false;

  screenState$: Observable<ScreenModel> | undefined;
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.screenState$ = this.store.select((store) => store.screen);
    this.screenState$.subscribe((screen) => (this.isMobile = screen.isMobile));
  }
}
