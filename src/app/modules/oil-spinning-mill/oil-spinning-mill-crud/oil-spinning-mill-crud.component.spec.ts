import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OilSpinningMillCrudComponent } from './oil-spinning-mill-crud.component';

describe('OilSpinningMillCrudComponent', () => {
  let component: OilSpinningMillCrudComponent;
  let fixture: ComponentFixture<OilSpinningMillCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OilSpinningMillCrudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OilSpinningMillCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
