import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
  standalone:true,
  imports:[IonicModule]
})
export class ItemDetailsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
