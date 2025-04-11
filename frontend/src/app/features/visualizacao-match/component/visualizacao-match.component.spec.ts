import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { VisualizacaoMatchComponent } from './visualizacao-match.component';

describe('VisualizacaoMatchComponent', () => {
  let component: VisualizacaoMatchComponent;
  let fixture: ComponentFixture<VisualizacaoMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        VisualizacaoMatchComponent, // Import the standalone component
        FormsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizacaoMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial student data', () => {
    expect(component.student.nome).toBe('Nome Sobrenome');
    expect(component.student.idade).toBe(16);
    expect(component.student.curso).toBe('Curso');
  });

  it('should have initial professional data', () => {
    expect(component.professional.nome).toBe('Nome Sobrenome');
    expect(component.professional.formacao).toBe('Formação');
    expect(component.professional.especialidade).toBe('Especialidade');
  });
});