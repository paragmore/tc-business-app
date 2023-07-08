import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-payment-creation-form',
  templateUrl: './payment-creation-form.component.html',
  styleUrls: ['./payment-creation-form.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class PaymentCreationFormComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
