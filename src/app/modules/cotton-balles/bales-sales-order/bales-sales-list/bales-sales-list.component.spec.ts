import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalesSalesListComponent } from './bales-sales-list.component';

describe('BalesSalesListComponent', () => {
  let component: BalesSalesListComponent;
  let fixture: ComponentFixture<BalesSalesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalesSalesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalesSalesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
