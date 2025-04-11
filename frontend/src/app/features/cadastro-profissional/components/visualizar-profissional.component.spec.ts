// visualizar-profissional.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Mudar para FormsModule
import { VisualizarProfissionalComponent } from './visualizar-profissional.component';

describe('VisualizarProfissionalComponent', () => {
  let component: VisualizarProfissionalComponent;
  let fixture: ComponentFixture<VisualizarProfissionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarProfissionalComponent, FormsModule] // Mudar para FormsModule
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarProfissionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize profissional object with empty values', () => {
    expect(component.profissional.nome).toBe('');
    expect(component.profissional.empresa).toBe('');
    expect(component.profissional.especialidade).toBe('');
  });
});