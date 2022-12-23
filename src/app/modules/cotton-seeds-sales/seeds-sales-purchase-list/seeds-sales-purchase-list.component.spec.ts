import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedsSalesPurchaseListComponent } from './seeds-sales-purchase-list.component';

describe('SeedsSalesPurchaseListComponent', () => {
  let component: SeedsSalesPurchaseListComponent;
  let fixture: ComponentFixture<SeedsSalesPurchaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedsSalesPurchaseListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedsSalesPurchaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
