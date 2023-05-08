import { Component, OnInit } from '@angular/core';
import { ItemCreationComponent } from './item-creation/item-creation.component';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
  standalone: true,
  imports:[ItemCreationComponent]
})
export class ItemsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
