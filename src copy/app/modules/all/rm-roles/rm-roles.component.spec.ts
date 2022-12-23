import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmRolesComponent } from './rm-roles.component';

describe('RmRolesComponent', () => {
  let component: RmRolesComponent;
  let fixture: ComponentFixture<RmRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmRolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
