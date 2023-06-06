import { Component, Injector, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DividedPageBuilderComponent } from 'src/app/core/components/divided-page-builder/divided-page-builder.component';
import { PartiesListComponent } from './parties-list/parties-list.component';
import { PartiesDetailsComponent } from './parties-details/parties-details.component';

@Component({
  selector: 'app-parties',
  templateUrl: './parties.component.html',
  styleUrls: ['./parties.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    DividedPageBuilderComponent,
    PartiesListComponent,
    PartiesDetailsComponent,
  ],
})
export class PartiesComponent implements OnInit {
  partiesListComponent = PartiesListComponent;
  partiesDetailsComponent = PartiesDetailsComponent;
  selectedTab: PartiesTabType = 'customers';
  partiesInjector!: Injector;
  constructor(private injector: Injector) {
    this.createInjector();
  }

  createInjector = () => {
    this.partiesInjector = Injector.create({
      providers: [
        { provide: 'selectedTab', useValue: this.selectedTab },
        { provide: 'updateSelectedTab', useValue: this.updateSelectedTab },
      ],
      parent: this.injector,
    });
  };

  ngOnInit() {
    this.createInjector();
  }
  updateSelectedTab = (newTab: PartiesTabType) => {
    console.log('idhar aye', newTab);
    this.selectedTab = newTab;
    console.log('change hua', this.selectedTab);
    this.createInjector();
  };
}

export type PartiesTabType = 'customers' | 'suppliers';
