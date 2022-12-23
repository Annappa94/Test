import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TussarFarmerDetailsComponent } from './tussar-farmer-details.component';

describe('TussarFarmerDetailsComponent', () => {
  let component: TussarFarmerDetailsComponent;
  let fixture: ComponentFixture<TussarFarmerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TussarFarmerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TussarFarmerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
