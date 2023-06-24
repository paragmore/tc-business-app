import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-right-header',
  templateUrl: './right-header.component.html',
  styleUrls: ['./right-header.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class RightHeaderComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
