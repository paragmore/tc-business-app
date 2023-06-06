import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreditDebitLedgerListComponent } from './credit-debit-ledger-list.component';

describe('CreditDebitLedgerListComponent', () => {
  let component: CreditDebitLedgerListComponent;
  let fixture: ComponentFixture<CreditDebitLedgerListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditDebitLedgerListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreditDebitLedgerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
