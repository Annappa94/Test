import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPlanCrudComponent } from './subscription-plan-crud.component';

describe('SubscriptionPlanCrudComponent', () => {
  let component: SubscriptionPlanCrudComponent;
  let fixture: ComponentFixture<SubscriptionPlanCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionPlanCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPlanCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
