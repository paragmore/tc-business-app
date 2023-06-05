import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VariantSeperatorPipe } from 'src/app/core/pipes/variant-seperator.pipe';
import { VariantI } from 'src/app/core/services/products/products.service';

@Component({
  selector: 'app-variants-list',
  templateUrl: './variants-list.component.html',
  styleUrls: ['./variants-list.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, VariantSeperatorPipe],
})
export class VariantsListComponent implements OnInit {
  @Input() variants?: VariantI[];
  @Input() readonly = false;
  constructor() {}

  ngOnInit() {}
}
