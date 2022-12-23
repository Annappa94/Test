import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CottonLotListComponent } from './cotton-lot-list.component';

describe('CottonLotListComponent', () => {
  let component: CottonLotListComponent;
  let fixture: ComponentFixture<CottonLotListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CottonLotListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CottonLotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
