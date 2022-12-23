import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinningMillsListComponent } from './spinning-mills-list.component';

describe('SpinningMillsListComponent', () => {
  let component: SpinningMillsListComponent;
  let fixture: ComponentFixture<SpinningMillsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpinningMillsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinningMillsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
