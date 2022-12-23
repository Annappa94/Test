import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReelerComponent } from './reeler.component';

describe('ReelerComponent', () => {
  let component: ReelerComponent;
  let fixture: ComponentFixture<ReelerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReelerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
