import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CottonSeedsOrdersListComponent } from './cotton-seeds-orders-list.component';

describe('CottonSeedsOrdersListComponent', () => {
  let component: CottonSeedsOrdersListComponent;
  let fixture: ComponentFixture<CottonSeedsOrdersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CottonSeedsOrdersListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CottonSeedsOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
