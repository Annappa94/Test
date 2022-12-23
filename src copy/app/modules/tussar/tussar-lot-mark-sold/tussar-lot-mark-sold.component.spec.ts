import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TussarLotMarkSoldComponent } from './tussar-lot-mark-sold.component';

describe('TussarLotMarkSoldComponent', () => {
  let component: TussarLotMarkSoldComponent;
  let fixture: ComponentFixture<TussarLotMarkSoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TussarLotMarkSoldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TussarLotMarkSoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
