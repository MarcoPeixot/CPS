import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchComponent } from './match.component';
import { ProfissionalService } from '../services/profissional.service';
import { AlunoProfissionalService } from '../services/aluno-profissional.service';
import { AlunoService } from '../services/aluno.service';

describe('MatchComponent', () => {
  let component: MatchComponent;
  let fixture: ComponentFixture<MatchComponent>;
  let mockActivatedRoute: any;
  let mockRouter: any;
  let mockProfissionalService: any;
  let mockAlunoProfissionalService: any;
  let mockAlunoService: any;

  beforeEach(async () => {

    mockActivatedRoute = {
      params: of({ id: '123' })
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockProfissionalService = {
      getProfissionais: jasmine.createSpy('getProfissionais').and.returnValue(of([
        { id: 1, nome: 'Dr. João', especialidade: 'Psicólogo' },
        { id: 2, nome: 'Dra. Maria', especialidade: 'Nutricionista' }
      ]))
    };

    mockAlunoProfissionalService = {
      associarAlunoProfissional: jasmine.createSpy('associarAlunoProfissional').and.returnValue(of({ id: 1, success: true }))
    };

    mockAlunoService = {
      getAlunoPorId: jasmine.createSpy('getAlunoPorId').and.returnValue(of({ id: 123, nome: 'Carlos da Silva' }))
    };

    await TestBed.configureTestingModule({
      declarations: [ MatchComponent ],
      imports: [ ReactiveFormsModule, FormsModule ],

      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: ProfissionalService, useValue: mockProfissionalService },
        { provide: AlunoProfissionalService, useValue: mockAlunoProfissionalService },
        { provide: AlunoService, useValue: mockAlunoService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values except alunoId', () => {
    expect(component.matchForm.value).toEqual({
      alunoId: 123,
      profissionalId: 0,
      dataInicio: '',
      dataFim: '',
      descricao: ''
    });
  });

  it('should load aluno data on init', () => {
    expect(mockAlunoService.getAlunoPorId).toHaveBeenCalledWith(123);
    expect(component.alunoNome).toBe('Carlos da Silva');
  });

  it('should load profissionais on init', () => {
    expect(mockProfissionalService.getProfissionais).toHaveBeenCalled();
    expect(component.profissionais.length).toBe(2);
    expect(component.profissionaisFiltrados.length).toBe(2);
  });

  it('should filter profissionais correctly', () => {
    component.searchText = 'jo';
    component.filtrarProfissionais();
    expect(component.profissionaisFiltrados.length).toBe(1);
    expect(component.profissionaisFiltrados[0].nome).toBe('Dr. João');
  });

  it('should select profissional correctly', () => {
    const profissional = { id: 1, nome: 'Dr. João', especialidade: 'Psicólogo' };
    component.selecionarProfissional(profissional);
    expect(component.profissionalSelecionado).toEqual(profissional);
    expect(component.matchForm.get('profissionalId')?.value).toBe(1);
    expect(component.searchText).toBe('Dr. João');
  });

  it('should remove selected profissional', () => {
    component.profissionalSelecionado = { id: 1, nome: 'Dr. João', especialidade: 'Psicólogo' };
    component.matchForm.patchValue({ profissionalId: 1 });
    component.searchText = 'Dr. João';
    component.removerProfissionalSelecionado();
    
    expect(component.profissionalSelecionado).toBeNull();
    expect(component.matchForm.get('profissionalId')?.value).toBe(0);
    expect(component.searchText).toBe('');
  });


  it('should validate form correctly', () => {
    expect(component.matchForm.valid).toBeFalsy();
    component.matchForm.patchValue({
      alunoId: 123,
      profissionalId: 1,
      dataInicio: '2023-10-15T10:00',
      descricao: 'Descrição do atendimento'
    });

    expect(component.matchForm.valid).toBeTruthy();
  });

  it('should call associarAlunoProfissional service when form is submitted and valid', () => {
    component.matchForm.patchValue({
      alunoId: 123,
      profissionalId: 1,
      dataInicio: '2023-10-15T10:00',
      descricao: 'Descrição do atendimento'
    }); 
    component.salvarMatch();

    expect(mockAlunoProfissionalService.associarAlunoProfissional).toHaveBeenCalledWith(123, 1);
  });

  it('should not call associarAlunoProfissional service when form is invalid', () => {
    component.salvarMatch();

    expect(mockAlunoProfissionalService.associarAlunoProfissional).not.toHaveBeenCalled();
  });

  it('should navigate back on cancel', () => {
    component.cancelar();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/alunos', 123]);
  });

  it('should toggle profissionais dropdown', () => {
    component.showOptions = false;
    component.toggleProfissionaisDropdown();
    expect(component.showOptions).toBe(true); 
    component.toggleProfissionaisDropdown();
    expect(component.showOptions).toBe(false);
  });
});