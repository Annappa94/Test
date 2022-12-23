import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTypeCrudComponent } from './device-type-crud.component';

describe('DeviceTypeCrudComponent', () => {
  let component: DeviceTypeCrudComponent;
  let fixture: ComponentFixture<DeviceTypeCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceTypeCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceTypeCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
