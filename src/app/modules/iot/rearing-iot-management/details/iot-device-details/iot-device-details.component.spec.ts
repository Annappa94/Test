import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IotDeviceDetailsComponent } from './iot-device-details.component';

describe('IotDeviceDetailsComponent', () => {
  let component: IotDeviceDetailsComponent;
  let fixture: ComponentFixture<IotDeviceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IotDeviceDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IotDeviceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
