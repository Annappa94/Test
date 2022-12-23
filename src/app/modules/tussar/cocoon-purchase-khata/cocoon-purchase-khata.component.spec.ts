import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocoonPurchaseKhataComponent } from './cocoon-purchase-khata.component';

describe('CocoonPurchaseKhataComponent', () => {
  let component: CocoonPurchaseKhataComponent;
  let fixture: ComponentFixture<CocoonPurchaseKhataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CocoonPurchaseKhataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CocoonPurchaseKhataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
