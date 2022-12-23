import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceListCrudComponent } from './device-list-crud.component';

describe('DeviceListCrudComponent', () => {
  let component: DeviceListCrudComponent;
  let fixture: ComponentFixture<DeviceListCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceListCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceListCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
