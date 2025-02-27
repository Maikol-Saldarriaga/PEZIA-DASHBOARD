import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightDashboardComponent } from './weight-dashboard.component';

describe('WeightDashboardComponent', () => {
  let component: WeightDashboardComponent;
  let fixture: ComponentFixture<WeightDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeightDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeightDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
