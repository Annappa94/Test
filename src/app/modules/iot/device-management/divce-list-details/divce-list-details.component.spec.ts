import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivceListDetailsComponent } from './divce-list-details.component';

describe('DivceListDetailsComponent', () => {
  let component: DivceListDetailsComponent;
  let fixture: ComponentFixture<DivceListDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivceListDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivceListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
