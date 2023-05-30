import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-dialog-header',
  templateUrl: './dialog-header.component.html',
  styleUrls: ['./dialog-header.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class DialogHeaderComponent implements OnInit {
  @Input()
  headerTitle!: string;

  @Input() onClose!: () => void;
  constructor() {}

  ngOnInit() {}
}
