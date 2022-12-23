import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinningDetailsComponent } from './spinning-details.component';

describe('SpinningDetailsComponent', () => {
  let component: SpinningDetailsComponent;
  let fixture: ComponentFixture<SpinningDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpinningDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinningDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
