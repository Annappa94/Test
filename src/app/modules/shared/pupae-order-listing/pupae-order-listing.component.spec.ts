import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupaeOrderListingComponent } from './pupae-order-listing.component';

describe('PupaeOrderListingComponent', () => {
  let component: PupaeOrderListingComponent;
  let fixture: ComponentFixture<PupaeOrderListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PupaeOrderListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PupaeOrderListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
