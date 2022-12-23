import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TussarListComponent } from './tussar-list.component';

describe('TussarListComponent', () => {
  let component: TussarListComponent;
  let fixture: ComponentFixture<TussarListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TussarListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TussarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
