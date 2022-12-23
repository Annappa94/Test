import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RearingIotDevicesComponent } from './rearing-iot-devices.component';

describe('RearingIotDevicesComponent', () => {
  let component: RearingIotDevicesComponent;
  let fixture: ComponentFixture<RearingIotDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RearingIotDevicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RearingIotDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
