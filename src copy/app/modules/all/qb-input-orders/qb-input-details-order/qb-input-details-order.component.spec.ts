import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbInputDetailsOrderComponent } from './qb-input-details-order.component';

describe('QbInputDetailsOrderComponent', () => {
  let component: QbInputDetailsOrderComponent;
  let fixture: ComponentFixture<QbInputDetailsOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbInputDetailsOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QbInputDetailsOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
