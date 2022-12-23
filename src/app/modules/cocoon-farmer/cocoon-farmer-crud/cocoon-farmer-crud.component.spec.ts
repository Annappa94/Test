import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocoonFarmerCrudComponent } from './cocoon-farmer-crud.component';

describe('CocoonFarmerCrudComponent', () => {
  let component: CocoonFarmerCrudComponent;
  let fixture: ComponentFixture<CocoonFarmerCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CocoonFarmerCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CocoonFarmerCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
