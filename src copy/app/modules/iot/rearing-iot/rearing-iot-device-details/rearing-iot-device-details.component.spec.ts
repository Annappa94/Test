import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RearingIotDeviceDetailsComponent } from './rearing-iot-device-details.component';

describe('RearingIotDeviceDetailsComponent', () => {
  let component: RearingIotDeviceDetailsComponent;
  let fixture: ComponentFixture<RearingIotDeviceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RearingIotDeviceDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RearingIotDeviceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
