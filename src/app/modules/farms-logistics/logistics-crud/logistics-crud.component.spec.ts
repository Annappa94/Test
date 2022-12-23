import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticsCrudComponent } from './logistics-crud.component';

describe('LogisticsCrudComponent', () => {
  let component: LogisticsCrudComponent;
  let fixture: ComponentFixture<LogisticsCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogisticsCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogisticsCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
