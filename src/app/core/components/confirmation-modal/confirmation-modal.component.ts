import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { DialogHeaderComponent } from '../dialog-header/dialog-header.component';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, DialogHeaderComponent],
})
export class ConfirmationModalComponent implements OnInit {
  @Input() confirmationModalInput!: ConfirmationModalInputI;
  constructor(private modalController: ModalController) {}

  ngOnInit() {
    console.log(this.confirmationModalInput);
  }

  onConfirmClicked() {
    this.confirmationModalInput.ctaButton.onClick();
  }

  onCloseConfirmationModal = () => {
    this.modalController.dismiss();
  };
}

export interface ConfirmationEventI {
  confirm: boolean;
}

export interface ConfirmationModalInputI {
  headerTitle: string;
  body: {
    title: string;
    icon: {
      name: string;
      class?: string;
    };
    subText: string;
  };
  ctaButton: {
    text: string;
    class?: string;
    onClick: () => void;
  };
}
