import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupaeOrderDetailsComponent } from './pupae-order-details.component';

describe('PupaeOrderDetailsComponent', () => {
  let component: PupaeOrderDetailsComponent;
  let fixture: ComponentFixture<PupaeOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PupaeOrderDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PupaeOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
