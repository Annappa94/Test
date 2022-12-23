import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupliersCrudComponent } from './supliers-crud.component';

describe('SupliersCrudComponent', () => {
  let component: SupliersCrudComponent;
  let fixture: ComponentFixture<SupliersCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupliersCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupliersCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
