import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocoonFarmerDetailsComponent } from './cocoon-farmer-details.component';

describe('CocoonFarmerDetailsComponent', () => {
  let component: CocoonFarmerDetailsComponent;
  let fixture: ComponentFixture<CocoonFarmerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CocoonFarmerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CocoonFarmerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
