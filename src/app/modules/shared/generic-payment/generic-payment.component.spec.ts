import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericPaymentComponent } from './generic-payment.component';

describe('GenericPaymentComponent', () => {
  let component: GenericPaymentComponent;
  let fixture: ComponentFixture<GenericPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
