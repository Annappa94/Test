import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignToBidComponent } from './assign-to-bid.component';

describe('AssignToBidComponent', () => {
  let component: AssignToBidComponent;
  let fixture: ComponentFixture<AssignToBidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignToBidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignToBidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
