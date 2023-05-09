import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {DividedPageBuilderComponent} from './../../core/components/divided-page-builder/divided-page-builder.component'
import { ItemCreationComponent } from './item-creation/item-creation.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { ItemsListComponent } from './items-list/items-list.component';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
  standalone: true,
  imports:[ItemCreationComponent, IonicModule, DividedPageBuilderComponent],
  providers:[ItemsListComponent,ItemDetailsComponent]
})
export class ItemsComponent  implements OnInit {
  itemsListComponent = ItemsListComponent;
  itemDetailsComponent = ItemDetailsComponent;
  constructor() { }

  ngOnInit() {}

}
