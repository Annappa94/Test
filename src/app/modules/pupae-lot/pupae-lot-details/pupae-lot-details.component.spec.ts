import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupaeLotDetailsComponent } from './pupae-lot-details.component';

describe('PupaeLotDetailsComponent', () => {
  let component: PupaeLotDetailsComponent;
  let fixture: ComponentFixture<PupaeLotDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PupaeLotDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PupaeLotDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
