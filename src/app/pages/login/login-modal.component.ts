import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ScreenModel } from '../../../app/store/models/screen.models';
import { AppState } from '../../../app/store/models/state.model';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls:['./login-modal.component.scss'],
  standalone:true,
  imports:[IonicModule, CommonModule]
})
export class LoginModalPage implements OnInit {
  @Input() modalHtml: string | undefined;
  public screenState$: Observable<ScreenModel> | undefined;

  constructor(private modalController: ModalController, private store: Store<AppState>) {}

  async closeModel() {
    const close: string = 'Modal Removed';
    await this.modalController.dismiss(close);
  }

  ngOnInit(): void {
    this.screenState$ = this.store.select((store) => store.screen);
  }
}
