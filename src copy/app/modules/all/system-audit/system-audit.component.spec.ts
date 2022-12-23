import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAuditComponent } from './system-audit.component';

describe('SystemAuditComponent', () => {
  let component: SystemAuditComponent;
  let fixture: ComponentFixture<SystemAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
