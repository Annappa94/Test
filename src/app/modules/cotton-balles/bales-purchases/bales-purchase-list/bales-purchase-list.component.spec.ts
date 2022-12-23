import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalesPurchaseListComponent } from './bales-purchase-list.component';

describe('BalesPurchaseListComponent', () => {
  let component: BalesPurchaseListComponent;
  let fixture: ComponentFixture<BalesPurchaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalesPurchaseListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalesPurchaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
