import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TussarOrderDetailsComponent } from './tussar-order-details.component';

describe('TussarOrderDetailsComponent', () => {
  let component: TussarOrderDetailsComponent;
  let fixture: ComponentFixture<TussarOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TussarOrderDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TussarOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
