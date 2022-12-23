import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocoonLotLogisticsComponent } from './cocoon-lot-logistics.component';

describe('CocoonLotLogisticsComponent', () => {
  let component: CocoonLotLogisticsComponent;
  let fixture: ComponentFixture<CocoonLotLogisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CocoonLotLogisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CocoonLotLogisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
