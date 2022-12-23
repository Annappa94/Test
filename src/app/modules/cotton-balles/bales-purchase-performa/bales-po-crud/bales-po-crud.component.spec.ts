import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalesPoCrudComponent } from './bales-po-crud.component';

describe('BalesPoCrudComponent', () => {
  let component: BalesPoCrudComponent;
  let fixture: ComponentFixture<BalesPoCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalesPoCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalesPoCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
