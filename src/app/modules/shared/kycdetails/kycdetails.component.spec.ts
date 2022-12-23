import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KYCdetailsComponent } from './kycdetails.component';

describe('KYCdetailsComponent', () => {
  let component: KYCdetailsComponent;
  let fixture: ComponentFixture<KYCdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KYCdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
