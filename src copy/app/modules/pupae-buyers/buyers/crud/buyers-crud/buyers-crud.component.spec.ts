import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyersCrudComponent } from './buyers-crud.component';

describe('BuyersCrudComponent', () => {
  let component: BuyersCrudComponent;
  let fixture: ComponentFixture<BuyersCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyersCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyersCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
