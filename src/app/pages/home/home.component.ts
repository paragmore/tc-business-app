import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RevenueChartComponent } from 'src/app/charts/revenue-chart.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonicModule, RevenueChartComponent],
})
export class HomeComponent implements OnInit {
  public route!: string;
  private activatedRoute = inject(ActivatedRoute);
  constructor() {}

  ngOnInit() {
    this.route = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }
}
