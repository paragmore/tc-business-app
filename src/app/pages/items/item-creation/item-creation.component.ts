import { Component, OnInit } from '@angular/core';
import { CheckboxCustomEvent, IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-item-creation',
  templateUrl: './item-creation.component.html',
  styleUrls: ['./item-creation.component.scss'],
  standalone: true,
  imports:[IonicModule]
})
export class ItemCreationComponent  implements OnInit {

  canDismiss = false;

  presentingElement: Element | null = null;

  constructor(private modalController: ModalController){

  }
  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
  }

  onTermsChanged(event: Event) {
    const ev = event as CheckboxCustomEvent;
    this.canDismiss = ev.detail.checked;
  }

}
