import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyersListComponent } from './buyers-list.component';

describe('BuyersListComponent', () => {
  let component: BuyersListComponent;
  let fixture: ComponentFixture<BuyersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
