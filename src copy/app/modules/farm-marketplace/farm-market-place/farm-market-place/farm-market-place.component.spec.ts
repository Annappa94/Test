import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmMarketPlaceComponent } from './farm-market-place.component';

describe('FarmMarketPlaceComponent', () => {
  let component: FarmMarketPlaceComponent;
  let fixture: ComponentFixture<FarmMarketPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarmMarketPlaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmMarketPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
