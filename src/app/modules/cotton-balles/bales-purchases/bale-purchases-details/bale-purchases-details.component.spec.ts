import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalePurchasesDetailsComponent } from './bale-purchases-details.component';

describe('BalePurchasesDetailsComponent', () => {
  let component: BalePurchasesDetailsComponent;
  let fixture: ComponentFixture<BalePurchasesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalePurchasesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalePurchasesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
