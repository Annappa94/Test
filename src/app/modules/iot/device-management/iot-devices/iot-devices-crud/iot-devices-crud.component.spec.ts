import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IotDevicesCrudComponent } from './iot-devices-crud.component';

describe('IotDevicesCrudComponent', () => {
  let component: IotDevicesCrudComponent;
  let fixture: ComponentFixture<IotDevicesCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IotDevicesCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IotDevicesCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
