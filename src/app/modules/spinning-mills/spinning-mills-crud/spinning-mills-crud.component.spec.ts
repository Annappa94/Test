import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinningMillsCrudComponent } from './spinning-mills-crud.component';

describe('SpinningMillsCrudComponent', () => {
  let component: SpinningMillsCrudComponent;
  let fixture: ComponentFixture<SpinningMillsCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpinningMillsCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinningMillsCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
