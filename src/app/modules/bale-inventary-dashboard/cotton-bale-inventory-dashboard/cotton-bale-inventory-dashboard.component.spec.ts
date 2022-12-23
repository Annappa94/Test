import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CottonBaleInventoryDashboardComponent } from './cotton-bale-inventory-dashboard.component';

describe('CottonBaleInventoryDashboardComponent', () => {
  let component: CottonBaleInventoryDashboardComponent;
  let fixture: ComponentFixture<CottonBaleInventoryDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CottonBaleInventoryDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CottonBaleInventoryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
