import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverCurdComponent } from './driver-curd.component';

describe('DriverCurdComponent', () => {
  let component: DriverCurdComponent;
  let fixture: ComponentFixture<DriverCurdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverCurdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverCurdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
