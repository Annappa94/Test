import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CBidListComponent } from './c-bid-list.component';

describe('CBidListComponent', () => {
  let component: CBidListComponent;
  let fixture: ComponentFixture<CBidListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CBidListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CBidListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
