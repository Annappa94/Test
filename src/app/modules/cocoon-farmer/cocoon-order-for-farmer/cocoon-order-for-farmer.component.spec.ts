import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocoonOrderForFarmerComponent } from './cocoon-order-for-farmer.component';

describe('CocoonOrderForFarmerComponent', () => {
  let component: CocoonOrderForFarmerComponent;
  let fixture: ComponentFixture<CocoonOrderForFarmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CocoonOrderForFarmerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CocoonOrderForFarmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
