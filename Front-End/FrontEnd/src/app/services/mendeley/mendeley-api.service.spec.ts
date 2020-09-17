import { TestBed } from '@angular/core/testing';

import { MendeleyApiService } from './mendeley-api.service';

describe('MendeleyApiService', () => {
  let service: MendeleyApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MendeleyApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
