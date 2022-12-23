import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RearingIotManagementComponent } from './rearing-iot-management.component';

describe('RearingIotManagementComponent', () => {
  let component: RearingIotManagementComponent;
  let fixture: ComponentFixture<RearingIotManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RearingIotManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RearingIotManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
