import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-suppliers-details',
  templateUrl: './suppliers-details.component.html',
  styleUrls: ['./suppliers-details.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class SuppliersDetailsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
