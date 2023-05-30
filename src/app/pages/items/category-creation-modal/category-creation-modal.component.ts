import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-category-creation-modal',
  templateUrl: './category-creation-modal.component.html',
  styleUrls: ['./category-creation-modal.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class CategoryCreationModalComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
