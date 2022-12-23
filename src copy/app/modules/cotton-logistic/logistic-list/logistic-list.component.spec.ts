import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticListComponent } from './logistic-list.component';

describe('LogisticListComponent', () => {
  let component: LogisticListComponent;
  let fixture: ComponentFixture<LogisticListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogisticListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogisticListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
