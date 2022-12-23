import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CottonOrderDetailsComponent } from './cotton-order-details.component';

describe('CottonOrderDetailsComponent', () => {
  let component: CottonOrderDetailsComponent;
  let fixture: ComponentFixture<CottonOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CottonOrderDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CottonOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
