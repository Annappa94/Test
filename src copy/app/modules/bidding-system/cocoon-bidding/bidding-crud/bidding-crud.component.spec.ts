import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiddingCrudComponent } from './bidding-crud.component';

describe('BiddingCrudComponent', () => {
  let component: BiddingCrudComponent;
  let fixture: ComponentFixture<BiddingCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiddingCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiddingCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
