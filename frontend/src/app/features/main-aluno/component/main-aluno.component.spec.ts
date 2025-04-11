import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAlunoComponent } from './main-aluno.component';

describe('MainAlunoComponent', () => {
  let component: MainAlunoComponent;
  let fixture: ComponentFixture<MainAlunoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainAlunoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainAlunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
