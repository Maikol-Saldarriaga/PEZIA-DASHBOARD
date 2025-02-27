import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OxigenoComponent } from './oxigeno.component';

describe('OxigenoComponent', () => {
  let component: OxigenoComponent;
  let fixture: ComponentFixture<OxigenoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OxigenoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OxigenoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
