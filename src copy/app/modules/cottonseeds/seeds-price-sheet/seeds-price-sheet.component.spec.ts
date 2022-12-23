import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedsPriceSheetComponent } from './seeds-price-sheet.component';

describe('SeedsPriceSheetComponent', () => {
  let component: SeedsPriceSheetComponent;
  let fixture: ComponentFixture<SeedsPriceSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedsPriceSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedsPriceSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
