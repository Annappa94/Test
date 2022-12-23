import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalePurchasesCrudComponent } from './bale-purchases-crud.component';

describe('BalePurchasesCrudComponent', () => {
  let component: BalePurchasesCrudComponent;
  let fixture: ComponentFixture<BalePurchasesCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalePurchasesCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalePurchasesCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
