import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupaeLotCrudComponent } from './pupae-lot-crud.component';

describe('PupaeLotCrudComponent', () => {
  let component: PupaeLotCrudComponent;
  let fixture: ComponentFixture<PupaeLotCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PupaeLotCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PupaeLotCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
