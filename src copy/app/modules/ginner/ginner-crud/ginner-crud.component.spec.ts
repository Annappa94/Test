import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GinnerCrudComponent } from './ginner-crud.component';

describe('GinnerCrudComponent', () => {
  let component: GinnerCrudComponent;
  let fixture: ComponentFixture<GinnerCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GinnerCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GinnerCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
