import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RearingIotSettingsComponent } from './rearing-iot-settings.component';

describe('RearingIotSettingsComponent', () => {
  let component: RearingIotSettingsComponent;
  let fixture: ComponentFixture<RearingIotSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RearingIotSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RearingIotSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
