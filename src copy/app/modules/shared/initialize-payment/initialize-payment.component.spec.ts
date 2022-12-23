import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitializePaymentComponent } from './initialize-payment.component';

describe('InitializePaymentComponent', () => {
  let component: InitializePaymentComponent;
  let fixture: ComponentFixture<InitializePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitializePaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitializePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
