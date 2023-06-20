import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MobilePartiesListHeaderComponent } from './mobile-parties-list-header.component';

describe('MobilePartiesListHeaderComponent', () => {
  let component: MobilePartiesListHeaderComponent;
  let fixture: ComponentFixture<MobilePartiesListHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MobilePartiesListHeaderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MobilePartiesListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
