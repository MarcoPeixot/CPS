import { TestBed } from '@angular/core/testing';

import { ProfissionalEspecialidadeService } from './profissional-especialidade.service';

describe('ProfissionalEspecialidadeService', () => {
  let service: ProfissionalEspecialidadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfissionalEspecialidadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
