import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TussarReelerCrudComponent } from './tussar-reeler-crud.component';

describe('TussarReelerCrudComponent', () => {
  let component: TussarReelerCrudComponent;
  let fixture: ComponentFixture<TussarReelerCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TussarReelerCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TussarReelerCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
