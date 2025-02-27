import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicacionAlimentacionComponent } from './medicacion-alimentacion.component';

describe('MedicacionAlimentacionComponent', () => {
  let component: MedicacionAlimentacionComponent;
  let fixture: ComponentFixture<MedicacionAlimentacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicacionAlimentacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicacionAlimentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
