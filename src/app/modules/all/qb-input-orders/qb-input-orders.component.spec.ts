import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbInputOrdersComponent } from './qb-input-orders.component';

describe('QbInputOrdersComponent', () => {
  let component: QbInputOrdersComponent;
  let fixture: ComponentFixture<QbInputOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbInputOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QbInputOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
