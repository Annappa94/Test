import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChawkiOrderListingComponent } from './chawki-order-listing.component';

describe('ChawkiOrderListingComponent', () => {
  let component: ChawkiOrderListingComponent;
  let fixture: ComponentFixture<ChawkiOrderListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChawkiOrderListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChawkiOrderListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
