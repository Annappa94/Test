import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RearingIotDevicelistComponent } from './rearing-iot-devicelist.component';

describe('RearingIotDevicelistComponent', () => {
  let component: RearingIotDevicelistComponent;
  let fixture: ComponentFixture<RearingIotDevicelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RearingIotDevicelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RearingIotDevicelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
