import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PHComponent } from './p-h.component';

describe('PHComponent', () => {
  let component: PHComponent;
  let fixture: ComponentFixture<PHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PHComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
