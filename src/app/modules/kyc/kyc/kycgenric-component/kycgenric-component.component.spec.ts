import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KYCGenricComponentComponent } from './kycgenric-component.component';

describe('KYCGenricComponentComponent', () => {
  let component: KYCGenricComponentComponent;
  let fixture: ComponentFixture<KYCGenricComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KYCGenricComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCGenricComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
