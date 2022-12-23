import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchButttonDynamicallyComponent } from './fetch-buttton-dynamically.component';

describe('FetchButttonDynamicallyComponent', () => {
  let component: FetchButttonDynamicallyComponent;
  let fixture: ComponentFixture<FetchButttonDynamicallyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FetchButttonDynamicallyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchButttonDynamicallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
