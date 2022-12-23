import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RearingIotManagementCrudComponent } from './rearing-iot-management-crud.component';

describe('RearingIotManagementCrudComponent', () => {
  let component: RearingIotManagementCrudComponent;
  let fixture: ComponentFixture<RearingIotManagementCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RearingIotManagementCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RearingIotManagementCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
