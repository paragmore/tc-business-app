import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  DiscountI,
  VariantI,
} from 'src/app/core/services/products/products.service';

@Component({
  selector: 'app-discounts-list',
  templateUrl: './discounts-list.component.html',
  styleUrls: ['./discounts-list.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class DiscountsListComponent implements OnInit {
  @Input() discounts?: DiscountI[];
  @Input() readonly = false;
  constructor() {}

  ngOnInit() {}
}
