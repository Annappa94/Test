import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoryListComponent } from './advisory-list.component';

describe('AdvisoryListComponent', () => {
  let component: AdvisoryListComponent;
  let fixture: ComponentFixture<AdvisoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvisoryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
