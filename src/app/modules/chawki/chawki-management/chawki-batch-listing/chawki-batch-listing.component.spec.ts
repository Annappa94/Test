import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChawkiBatchListingComponent } from './chawki-batch-listing.component';

describe('ChawkiBatchListingComponent', () => {
  let component: ChawkiBatchListingComponent;
  let fixture: ComponentFixture<ChawkiBatchListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChawkiBatchListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChawkiBatchListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
