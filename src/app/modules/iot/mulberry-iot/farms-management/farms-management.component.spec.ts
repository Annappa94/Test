import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmsManagementComponent } from './farms-management.component';

describe('FarmsManagementComponent', () => {
  let component: FarmsManagementComponent;
  let fixture: ComponentFixture<FarmsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarmsManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
