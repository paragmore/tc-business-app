import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PeriodSelectionComponent } from './period-selection.component';

describe('PeriodSelectionComponent', () => {
  let component: PeriodSelectionComponent;
  let fixture: ComponentFixture<PeriodSelectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodSelectionComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PeriodSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
