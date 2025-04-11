import { TestBed } from '@angular/core/testing';

import { DeficienciaService } from './deficiencia.service';

describe('DeficienciaService', () => {
  let service: DeficienciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeficienciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
