import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalesPoListComponent } from './bales-po-list.component';

describe('BalesPoListComponent', () => {
  let component: BalesPoListComponent;
  let fixture: ComponentFixture<BalesPoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalesPoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalesPoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
