import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainProfissionalComponent } from './main-profissional.component';

describe('MainProfissionalComponent', () => {
  let component: MainProfissionalComponent;
  let fixture: ComponentFixture<MainProfissionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainProfissionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainProfissionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
