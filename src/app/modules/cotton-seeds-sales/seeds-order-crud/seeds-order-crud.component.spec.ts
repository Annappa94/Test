import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedsOrderCrudComponent } from './seeds-order-crud.component';

describe('SeedsOrderCrudComponent', () => {
  let component: SeedsOrderCrudComponent;
  let fixture: ComponentFixture<SeedsOrderCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedsOrderCrudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedsOrderCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
