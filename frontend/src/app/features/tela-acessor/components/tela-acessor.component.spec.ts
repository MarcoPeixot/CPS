import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaAcessorComponent } from './tela-acessor.component';

describe('TelaAcessorComponent', () => {
  let component: TelaAcessorComponent;
  let fixture: ComponentFixture<TelaAcessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaAcessorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaAcessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
