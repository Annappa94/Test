import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CottonLotDetailsComponent } from './cotton-lot-details.component';

describe('CottonLotDetailsComponent', () => {
  let component: CottonLotDetailsComponent;
  let fixture: ComponentFixture<CottonLotDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CottonLotDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CottonLotDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
