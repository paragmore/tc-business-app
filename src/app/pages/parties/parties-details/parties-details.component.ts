import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PartiesTabType } from '../parties.component';

@Component({
  selector: 'app-parties-details',
  templateUrl: './parties-details.component.html',
  styleUrls: ['./parties-details.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class PartiesDetailsComponent implements OnInit {
  @Input() selectedTab!: PartiesTabType;

  constructor() {}

  ngOnInit() {}
}
