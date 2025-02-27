import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DasboardProductionComponent } from './dasboard-production.component';

describe('DasboardProductionComponent', () => {
  let component: DasboardProductionComponent;
  let fixture: ComponentFixture<DasboardProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DasboardProductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DasboardProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
