import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-period-selection',
  templateUrl: './period-selection.component.html',
  styleUrls: ['./period-selection.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class PeriodSelectionComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
