import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CottonOrderMarkSoldComponent } from './cotton-order-mark-sold.component';

describe('CottonOrderMarkSoldComponent', () => {
  let component: CottonOrderMarkSoldComponent;
  let fixture: ComponentFixture<CottonOrderMarkSoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CottonOrderMarkSoldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CottonOrderMarkSoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
