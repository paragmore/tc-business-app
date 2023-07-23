import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PaymentsListComponent } from './payments-list/payments-list.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { ActivatedRoute } from '@angular/router';
import { DividedPageBuilderComponent } from 'src/app/core/components/divided-page-builder/divided-page-builder.component';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, DividedPageBuilderComponent],
})
export class PaymentsComponent implements OnInit {
  paymentsListComponent = PaymentsListComponent;
  paymentDetailsComponent = PaymentDetailsComponent;
  public route!: string;
  private activatedRoute = inject(ActivatedRoute);
  constructor() {}

  ngOnInit() {
    this.route = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }
}
