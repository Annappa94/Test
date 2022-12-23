import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TussarLotCrudComponent } from './tussar-lot-crud.component';

describe('TussarLotCrudComponent', () => {
  let component: TussarLotCrudComponent;
  let fixture: ComponentFixture<TussarLotCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TussarLotCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TussarLotCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
