import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CottonSeedSalesDetailsComponent } from './cotton-seed-sales-details.component';

describe('CottonSeedSalesDetailsComponent', () => {
  let component: CottonSeedSalesDetailsComponent;
  let fixture: ComponentFixture<CottonSeedSalesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CottonSeedSalesDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CottonSeedSalesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
