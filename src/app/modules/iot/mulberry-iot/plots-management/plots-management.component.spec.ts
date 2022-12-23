import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotsManagementComponent } from './plots-management.component';

describe('PlotsManagementComponent', () => {
  let component: PlotsManagementComponent;
  let fixture: ComponentFixture<PlotsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlotsManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
