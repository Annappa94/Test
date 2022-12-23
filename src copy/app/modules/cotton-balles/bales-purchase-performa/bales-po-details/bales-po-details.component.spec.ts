import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalesPoDetailsComponent } from './bales-po-details.component';

describe('BalesPoDetailsComponent', () => {
  let component: BalesPoDetailsComponent;
  let fixture: ComponentFixture<BalesPoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalesPoDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalesPoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
