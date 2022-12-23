import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GinnerDetailsComponent } from './ginner-details.component';

describe('GinnerDetailsComponent', () => {
  let component: GinnerDetailsComponent;
  let fixture: ComponentFixture<GinnerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GinnerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GinnerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
