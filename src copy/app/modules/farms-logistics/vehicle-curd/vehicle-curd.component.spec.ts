import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleCurdComponent } from './vehicle-curd.component';

describe('VehicleCurdComponent', () => {
  let component: VehicleCurdComponent;
  let fixture: ComponentFixture<VehicleCurdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleCurdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleCurdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
