import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChawkiComponent } from './chawki.component';

describe('ChawkiComponent', () => {
  let component: ChawkiComponent;
  let fixture: ComponentFixture<ChawkiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChawkiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChawkiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
