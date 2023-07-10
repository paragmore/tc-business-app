import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MobileTransactionsListHeaderComponent } from './mobile-transactions-list-header.component';

describe('MobileTransactionsListHeaderComponent', () => {
  let component: MobileTransactionsListHeaderComponent;
  let fixture: ComponentFixture<MobileTransactionsListHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileTransactionsListHeaderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MobileTransactionsListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
