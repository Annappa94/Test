import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwistingUnitComponent } from './twisting-unit.component';

describe('TwistingUnitComponent', () => {
  let component: TwistingUnitComponent;
  let fixture: ComponentFixture<TwistingUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwistingUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwistingUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
