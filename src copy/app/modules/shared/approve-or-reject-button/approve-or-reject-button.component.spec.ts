import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveOrRejectButtonComponent } from './approve-or-reject-button.component';

describe('ApproveOrRejectButtonComponent', () => {
  let component: ApproveOrRejectButtonComponent;
  let fixture: ComponentFixture<ApproveOrRejectButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveOrRejectButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveOrRejectButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
