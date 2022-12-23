import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TussarFarmerListComponent } from './tussar-farmer-list.component';

describe('TussarFarmerListComponent', () => {
  let component: TussarFarmerListComponent;
  let fixture: ComponentFixture<TussarFarmerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TussarFarmerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TussarFarmerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
