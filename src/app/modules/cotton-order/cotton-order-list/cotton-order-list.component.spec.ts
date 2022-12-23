import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CottonOrderListComponent } from './cotton-order-list.component';

describe('CottonOrderListComponent', () => {
  let component: CottonOrderListComponent;
  let fixture: ComponentFixture<CottonOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CottonOrderListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CottonOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
