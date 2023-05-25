import { TestBed } from '@angular/core/testing';

import { CurrentStoreInfoService } from './current-store-info.service';

describe('CurrentStoreInfoService', () => {
  let service: CurrentStoreInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentStoreInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
