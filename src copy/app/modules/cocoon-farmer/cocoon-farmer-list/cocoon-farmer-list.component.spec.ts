import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocoonFarmerListComponent } from './cocoon-farmer-list.component';

describe('CocoonFarmerListComponent', () => {
  let component: CocoonFarmerListComponent;
  let fixture: ComponentFixture<CocoonFarmerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CocoonFarmerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CocoonFarmerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
