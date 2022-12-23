import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCocoonPurchaseKhataComponent } from './payment-cocoon-purchase-khata.component';

describe('PaymentCocoonPurchaseKhataComponent', () => {
  let component: PaymentCocoonPurchaseKhataComponent;
  let fixture: ComponentFixture<PaymentCocoonPurchaseKhataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentCocoonPurchaseKhataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCocoonPurchaseKhataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
