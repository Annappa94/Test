import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MulberryIotDevicesComponent } from './mulberry-iot-devices.component';

describe('MulberryIotDevicesComponent', () => {
  let component: MulberryIotDevicesComponent;
  let fixture: ComponentFixture<MulberryIotDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MulberryIotDevicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MulberryIotDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
