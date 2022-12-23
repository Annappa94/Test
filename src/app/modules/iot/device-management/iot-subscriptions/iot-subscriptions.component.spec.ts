import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IotSubscriptionsComponent } from './iot-subscriptions.component';

describe('IotSubscriptionsComponent', () => {
  let component: IotSubscriptionsComponent;
  let fixture: ComponentFixture<IotSubscriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IotSubscriptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IotSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
