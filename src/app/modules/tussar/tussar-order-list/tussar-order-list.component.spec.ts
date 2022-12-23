import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TussarOrderListComponent } from './tussar-order-list.component';

describe('TussarOrderListComponent', () => {
  let component: TussarOrderListComponent;
  let fixture: ComponentFixture<TussarOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TussarOrderListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TussarOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
