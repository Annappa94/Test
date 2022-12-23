import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RearingIotAdvisoryListComponent } from './rearing-iot-advisory-list.component';

describe('RearingIotAdvisoryListComponent', () => {
  let component: RearingIotAdvisoryListComponent;
  let fixture: ComponentFixture<RearingIotAdvisoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RearingIotAdvisoryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RearingIotAdvisoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
