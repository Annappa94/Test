import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalesSalesOrderCrudComponent } from './bales-sales-order-crud.component';

describe('BalesSalesOrderCrudComponent', () => {
  let component: BalesSalesOrderCrudComponent;
  let fixture: ComponentFixture<BalesSalesOrderCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalesSalesOrderCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalesSalesOrderCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
