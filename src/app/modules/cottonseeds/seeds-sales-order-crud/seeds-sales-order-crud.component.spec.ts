import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedsSalesOrderCrudComponent } from './seeds-sales-order-crud.component';

describe('SeedsSalesOrderCrudComponent', () => {
  let component: SeedsSalesOrderCrudComponent;
  let fixture: ComponentFixture<SeedsSalesOrderCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedsSalesOrderCrudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedsSalesOrderCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
