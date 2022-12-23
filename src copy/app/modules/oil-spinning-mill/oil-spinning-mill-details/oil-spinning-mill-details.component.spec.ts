import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OilSpinningMillDetailsComponent } from './oil-spinning-mill-details.component';

describe('OilSpinningMillDetailsComponent', () => {
  let component: OilSpinningMillDetailsComponent;
  let fixture: ComponentFixture<OilSpinningMillDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OilSpinningMillDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OilSpinningMillDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
