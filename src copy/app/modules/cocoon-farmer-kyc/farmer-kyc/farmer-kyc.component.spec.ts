import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerKycComponent } from './farmer-kyc.component';

describe('FarmerKycComponent', () => {
  let component: FarmerKycComponent;
  let fixture: ComponentFixture<FarmerKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarmerKycComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
