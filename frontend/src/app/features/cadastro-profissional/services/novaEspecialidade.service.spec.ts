import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NovaEspecialidadeService } from './novaEspecialidade.service';

describe('NovaEspecialidadeService', () => {
  let service: NovaEspecialidadeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [NovaEspecialidadeService]
    });
    service = TestBed.inject(NovaEspecialidadeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve listar novas especialidades', () => {
    const mockNovasEspecialidades = [
      { id: 1, nome: 'Nova Especialidade 1' },
      { id: 2, nome: 'Nova Especialidade 2' }
    ];

    service.listarNovasEspecialidades().subscribe(especialidades => {
      expect(especialidades).toEqual(mockNovasEspecialidades);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/nova-especialidade`);
    expect(req.request.method).toBe('GET');
    req.flush(mockNovasEspecialidades);
  });

  it('deve buscar uma nova especialidade por ID', () => {
    const mockNovaEspecialidade = { id: 1, nome: 'Nova Especialidade 1' };

    service.buscarNovaEspecialidade(1).subscribe(especialidade => {
      expect(especialidade).toEqual(mockNovaEspecialidade);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/nova-especialidade/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockNovaEspecialidade);
  });

  it('deve criar uma nova especialidade', () => {
    const novaEspecialidade = { nome: 'Nova Especialidade Teste' };

    service.criarNovaEspecialidade(novaEspecialidade).subscribe(especialidade => {
      expect(especialidade).toEqual(novaEspecialidade);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/nova-especialidade`);
    expect(req.request.method).toBe('POST');
    req.flush(novaEspecialidade);
  });

  it('deve atualizar uma nova especialidade', () => {
    const especialidadeAtualizada = { id: 1, nome: 'Nova Especialidade Atualizada' };

    service.atualizarNovaEspecialidade(1, especialidadeAtualizada).subscribe(especialidade => {
      expect(especialidade).toEqual(especialidadeAtualizada);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/nova-especialidade/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(especialidadeAtualizada);
  });

  it('deve deletar uma nova especialidade', () => {
    service.deletarNovaEspecialidade(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/nova-especialidade/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});