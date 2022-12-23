import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CottonSeedsPriceSheetComponent } from './cotton-seeds-price-sheet.component';

describe('CottonSeedsPriceSheetComponent', () => {
  let component: CottonSeedsPriceSheetComponent;
  let fixture: ComponentFixture<CottonSeedsPriceSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CottonSeedsPriceSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CottonSeedsPriceSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
