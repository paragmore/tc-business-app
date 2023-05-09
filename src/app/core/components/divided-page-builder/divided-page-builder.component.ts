import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ItemDetailsComponent } from 'src/app/pages/items/item-details/item-details.component';
import { ItemsListComponent } from 'src/app/pages/items/items-list/items-list.component';

@Component({
  selector: 'app-divided-page-builder',
  templateUrl: './divided-page-builder.component.html',
  styleUrls: ['./divided-page-builder.component.scss'],
  standalone: true,
  imports:[IonicModule, CommonModule, ItemsListComponent, ItemDetailsComponent]
})
export class DividedPageBuilderComponent  implements OnInit {

  @Input() listComponent: any
  @Input() detailsComponent: any
  constructor() {
    console.log(this.listComponent,this.detailsComponent)
  }

  ngOnInit() {
    console.log(this.listComponent,this.detailsComponent)
  }

}
