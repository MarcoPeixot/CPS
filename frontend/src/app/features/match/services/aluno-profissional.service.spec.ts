import { TestBed } from '@angular/core/testing';

import { AlunoProfissionalService } from './aluno-profissional.service';

describe('AlunoProfissionalService', () => {
  let service: AlunoProfissionalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlunoProfissionalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
