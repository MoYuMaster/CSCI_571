import { TestBed } from '@angular/core/testing';

import { AutoServiceService } from './auto-service.service';

describe('AutoServiceService', () => {
  let service: AutoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
