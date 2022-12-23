import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MulberryDetailsComponent } from './mulberry-details.component';

describe('MulberryDetailsComponent', () => {
  let component: MulberryDetailsComponent;
  let fixture: ComponentFixture<MulberryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MulberryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MulberryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
