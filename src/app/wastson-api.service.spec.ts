import { TestBed } from '@angular/core/testing';

import { WastsonApiService } from './wastson-api.service';

describe('WastsonApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WastsonApiService = TestBed.get(WastsonApiService);
    expect(service).toBeTruthy();
  });
});
