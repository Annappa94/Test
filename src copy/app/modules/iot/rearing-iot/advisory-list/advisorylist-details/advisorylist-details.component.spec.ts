import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisorylistDetailsComponent } from './advisorylist-details.component';

describe('AdvisorylistDetailsComponent', () => {
  let component: AdvisorylistDetailsComponent;
  let fixture: ComponentFixture<AdvisorylistDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvisorylistDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisorylistDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
