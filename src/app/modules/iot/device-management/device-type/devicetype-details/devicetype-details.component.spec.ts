import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicetypeDetailsComponent } from './devicetype-details.component';

describe('DevicetypeDetailsComponent', () => {
  let component: DevicetypeDetailsComponent;
  let fixture: ComponentFixture<DevicetypeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevicetypeDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicetypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
