import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerKhataComponent } from './farmer-khata.component';

describe('FarmerKhataComponent', () => {
  let component: FarmerKhataComponent;
  let fixture: ComponentFixture<FarmerKhataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarmerKhataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerKhataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
