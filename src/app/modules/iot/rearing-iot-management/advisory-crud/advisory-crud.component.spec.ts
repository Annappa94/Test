import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoryCrudComponent } from './advisory-crud.component';

describe('AdvisoryCrudComponent', () => {
  let component: AdvisoryCrudComponent;
  let fixture: ComponentFixture<AdvisoryCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvisoryCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisoryCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
