import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class PaymentDetailsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
