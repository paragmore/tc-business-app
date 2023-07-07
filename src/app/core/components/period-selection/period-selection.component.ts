import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PeriodRangeEnum } from '../../utils/startEndDates';

@Component({
  selector: 'app-period-selection',
  templateUrl: './period-selection.component.html',
  styleUrls: ['./period-selection.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class PeriodSelectionComponent implements OnInit {
  @Output() onSelect: EventEmitter<PeriodRangeEnum> =
    new EventEmitter<PeriodRangeEnum>();
  periods = Object.values(PeriodRangeEnum);
  constructor() {}

  onSelectEvent(event: PeriodRangeEnum) {
    if (event) {
      this.onSelect.emit(event);
    }
  }

  ngOnInit() {}
}
