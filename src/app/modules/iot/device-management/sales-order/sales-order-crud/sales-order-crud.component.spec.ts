import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderCrudComponent } from './sales-order-crud.component';

describe('SalesOrderCrudComponent', () => {
  let component: SalesOrderCrudComponent;
  let fixture: ComponentFixture<SalesOrderCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesOrderCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
