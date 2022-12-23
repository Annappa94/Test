import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CottonOrderpaymentComponent } from './cotton-orderpayment.component';

describe('CottonOrderpaymentComponent', () => {
  let component: CottonOrderpaymentComponent;
  let fixture: ComponentFixture<CottonOrderpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CottonOrderpaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CottonOrderpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
