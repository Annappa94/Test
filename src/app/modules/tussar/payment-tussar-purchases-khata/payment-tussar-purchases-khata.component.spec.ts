import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTussarPurchasesKhataComponent } from './payment-tussar-purchases-khata.component';

describe('PaymentTussarPurchasesKhataComponent', () => {
  let component: PaymentTussarPurchasesKhataComponent;
  let fixture: ComponentFixture<PaymentTussarPurchasesKhataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentTussarPurchasesKhataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTussarPurchasesKhataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
