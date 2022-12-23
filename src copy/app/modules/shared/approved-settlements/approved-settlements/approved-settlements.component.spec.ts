import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedSettlementsComponent } from './approved-settlements.component';

describe('ApprovedSettlementsComponent', () => {
  let component: ApprovedSettlementsComponent;
  let fixture: ComponentFixture<ApprovedSettlementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedSettlementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedSettlementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
