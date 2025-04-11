import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render email and password inputs', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('input[type="email"]')).toBeTruthy();
    expect(compiled.querySelector('input[type="password"]')).toBeTruthy();
  });

  it('should render the entrar button', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.btn-entrar')).toBeTruthy();
  });

  it('should render the Google login button', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.google-btn')).toBeTruthy();
  });

  it('should render the registration link', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.register-link')).toBeTruthy();
    expect(compiled.querySelector('.register-link').textContent).toContain('Cadastrar-se');
  });
});