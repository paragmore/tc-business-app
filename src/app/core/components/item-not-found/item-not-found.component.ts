import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-item-not-found',
  templateUrl: './item-not-found.component.html',
  styleUrls: ['./item-not-found.component.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true,
})
export class ItemNotFoundComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
