import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TussarLotDetaislComponent } from './tussar-lot-detaisl.component';

describe('TussarLotDetaislComponent', () => {
  let component: TussarLotDetaislComponent;
  let fixture: ComponentFixture<TussarLotDetaislComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TussarLotDetaislComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TussarLotDetaislComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
