import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MortalidadComponent } from './mortalidad.component';

describe('MortalidadComponent', () => {
  let component: MortalidadComponent;
  let fixture: ComponentFixture<MortalidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MortalidadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MortalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
