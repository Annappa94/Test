import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmCenterAuditComponent } from './rm-center-audit.component';

describe('RmCenterAuditComponent', () => {
  let component: RmCenterAuditComponent;
  let fixture: ComponentFixture<RmCenterAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmCenterAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmCenterAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
