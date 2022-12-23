import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateCancelComponent } from './mandate-cancel.component';

describe('MandateCancelComponent', () => {
  let component: MandateCancelComponent;
  let fixture: ComponentFixture<MandateCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MandateCancelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
