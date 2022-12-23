import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerDepositsComponent } from './retailer-deposits.component';

describe('RetailerDepositsComponent', () => {
  let component: RetailerDepositsComponent;
  let fixture: ComponentFixture<RetailerDepositsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailerDepositsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailerDepositsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
