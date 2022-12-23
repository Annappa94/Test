import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GinnerListComponent } from './ginner-list.component';

describe('GinnerListComponent', () => {
  let component: GinnerListComponent;
  let fixture: ComponentFixture<GinnerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GinnerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GinnerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
