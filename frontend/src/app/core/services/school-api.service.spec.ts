import { TestBed } from '@angular/core/testing';

import { SchoolApiService } from './school-api.service';

describe('SchoolApiService', () => {
  let service: SchoolApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
