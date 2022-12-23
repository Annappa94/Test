import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TussarFarmerCrudComponent } from './tussar-farmer-crud.component';

describe('TussarFarmerCrudComponent', () => {
  let component: TussarFarmerCrudComponent;
  let fixture: ComponentFixture<TussarFarmerCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TussarFarmerCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TussarFarmerCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
