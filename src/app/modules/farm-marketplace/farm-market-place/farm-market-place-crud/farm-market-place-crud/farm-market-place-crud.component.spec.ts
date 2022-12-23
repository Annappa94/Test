import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmMarketPlaceCrudComponent } from './farm-market-place-crud.component';

describe('FarmMarketPlaceCrudComponent', () => {
  let component: FarmMarketPlaceCrudComponent;
  let fixture: ComponentFixture<FarmMarketPlaceCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarmMarketPlaceCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmMarketPlaceCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
