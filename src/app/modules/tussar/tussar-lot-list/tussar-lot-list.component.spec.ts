import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TussarLotListComponent } from './tussar-lot-list.component';

describe('TussarLotListComponent', () => {
  let component: TussarLotListComponent;
  let fixture: ComponentFixture<TussarLotListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TussarLotListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TussarLotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
