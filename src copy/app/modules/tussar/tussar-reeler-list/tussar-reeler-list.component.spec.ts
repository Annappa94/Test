import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TussarReelerListComponent } from './tussar-reeler-list.component';

describe('TussarReelerListComponent', () => {
  let component: TussarReelerListComponent;
  let fixture: ComponentFixture<TussarReelerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TussarReelerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TussarReelerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
