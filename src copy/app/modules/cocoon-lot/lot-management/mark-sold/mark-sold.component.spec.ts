import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkSoldComponent } from './mark-sold.component';

describe('MarkSoldComponent', () => {
  let component: MarkSoldComponent;
  let fixture: ComponentFixture<MarkSoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkSoldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkSoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
