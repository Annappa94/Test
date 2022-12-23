import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupaeLotListComponent } from './pupae-lot-list.component';

describe('PupaeLotListComponent', () => {
  let component: PupaeLotListComponent;
  let fixture: ComponentFixture<PupaeLotListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PupaeLotListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PupaeLotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
