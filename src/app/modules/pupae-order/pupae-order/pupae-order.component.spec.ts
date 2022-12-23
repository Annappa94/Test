import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupaeOrderComponent } from './pupae-order.component';

describe('PupaeOrderComponent', () => {
  let component: PupaeOrderComponent;
  let fixture: ComponentFixture<PupaeOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PupaeOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PupaeOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
