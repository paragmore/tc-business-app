import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ItemCreationComponent } from '../item-creation/item-creation.component';
import { ProductsService } from 'src/app/core/services/products/products.service';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss'],
  standalone: true,
  imports: [IonicModule, ItemCreationComponent],
})
export class ItemsListComponent implements OnInit {
  constructor(private productsService: ProductsService) {}

  ngOnInit() {}
}
