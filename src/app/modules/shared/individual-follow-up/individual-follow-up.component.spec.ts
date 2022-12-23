import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualFollowUpComponent } from './individual-follow-up.component';

describe('IndividualFollowUpComponent', () => {
  let component: IndividualFollowUpComponent;
  let fixture: ComponentFixture<IndividualFollowUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualFollowUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
