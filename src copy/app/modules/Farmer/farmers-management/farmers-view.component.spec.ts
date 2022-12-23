import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmersViewComponent } from './farmers-view.component';

describe('FarmersViewComponent', () => {
  let component: FarmersViewComponent;
  let fixture: ComponentFixture<FarmersViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarmersViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
