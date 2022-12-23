import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TussarLotLogisticsComponent } from './tussar-lot-logistics.component';

describe('TussarLotLogisticsComponent', () => {
  let component: TussarLotLogisticsComponent;
  let fixture: ComponentFixture<TussarLotLogisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TussarLotLogisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TussarLotLogisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
